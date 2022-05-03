using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR
{
    public class MessageHub : Hub
    {

        private readonly IMapper _mapper;

        private readonly IUnitOfWork _unitOfWork;
        private readonly IHubContext<PresenceHub> _presenceHub;
        private readonly PresenceTracker _tracker;
        public MessageHub(IUnitOfWork unitOfWork, IMapper mapper,
        IHubContext<PresenceHub> presenceHub,
        PresenceTracker tracker)
        {
            _mapper = mapper;
            _unitOfWork = unitOfWork;
            _presenceHub = presenceHub;
            _tracker = tracker;
        }

        public override async Task OnConnectedAsync()
        {
            var httpContext = Context.GetHttpContext();
            //Getting user through http 
            var otherUser = httpContext.Request.Query["user"].ToString();
            var groupName = GetGroupName(Context.User.GetUsername(), otherUser);
            //Using Hub to add Group to Connection lists
            //Using ConnectionId from Hub Context
            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);

            //Adding group and connections
            var group = await AddToGroup(groupName);

            await Clients.Group(groupName).SendAsync("UpdateGroup", group);

            //Getting Messages between both users from repository
            var messages = await _unitOfWork.messageRepository
            .GetMessageThread(Context.User.GetUsername(), otherUser);

            if (_unitOfWork.HasChanges())
            {
                await _unitOfWork.Complete();
            }


            //Sending ReceiveMessageThread to group
            await Clients.Caller.SendAsync("ReceiveMessageThread", messages);
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            var group = await RemoveFromMessageGroup();
            await Clients.Group(group.Name).SendAsync("UpdateGroup", group);
            await base.OnDisconnectedAsync(exception);
        }

        //Adding Group To Group Connections
        private async Task<Group> AddToGroup(string groupName)
        {
            //Getting the Message Group with groupName
            var group = await _unitOfWork.messageRepository.GetMessageGroup(groupName);
            var connection = new Connection(Context.ConnectionId, Context.User.GetUsername());

            //If There is no group a new one will be created
            if (group == null) {
                group = new Group(groupName);
                _unitOfWork.messageRepository.AddGroup(group);
            }

            //Adding new connection to group
            group.Connections.Add(connection);

            if(await _unitOfWork.Complete())
            {
                return group;
            }

            throw new HubException("Failed to join group");
            
        }


        //Removing connection Id from the Group
        private async Task<Group> RemoveFromMessageGroup()
        {
            var group = await _unitOfWork.messageRepository.GetGroupForConnection(Context.ConnectionId);
            var connection = group.Connections.FirstOrDefault(x => x.ConnectionId == Context.ConnectionId);
            _unitOfWork.messageRepository.RemoveConnection(connection);
            await _unitOfWork.Complete();

            if (await _unitOfWork.Complete()) return group;

            throw new HubException("Failed to remove from group");
        }


        //Create method to send a new message to the group
        public async Task SendMessage(CreateMessageDto createMessageDto)
        {
            var username = Context.User.GetUsername();

            if(username == createMessageDto.RecipientUsername.ToLower())
            {
                throw new HubException("You cannot send messages to yourself");
            }

            var sender = await _unitOfWork.userRepository.GetUserByUsernameAsync(username);
            var recipient = await _unitOfWork.userRepository.GetUserByUsernameAsync(createMessageDto.RecipientUsername);

            if(recipient == null) 
            {
                throw new HubException("Not found user");
            }

            var message = new Message
            {
                Sender = sender,
                Recipient = recipient,
                SenderUsername = sender.UserName,
                RecipientUsername = recipient.UserName,
                Content = createMessageDto.Content
            };

            //Checking groups for connections
            var groupName = GetGroupName(sender.UserName, recipient.UserName);

            var group = await _unitOfWork.messageRepository.GetMessageGroup(groupName);

            //Checking if Recipient User is Connected and marks date read if user is in the Group connections
            if(group.Connections.Any(x => x.Username == recipient.UserName))
            {
                message.DateRead = DateTime.UtcNow;
            }
            else 
            {
                //Cheking if user is present in app to recieve the UX operation for user
                var connections = await _tracker.GetConnectionsForUser(recipient.UserName);
                if (connections != null)
                {
                    await _presenceHub.Clients.Clients(connections).SendAsync("NewMessageReceived",
                        new {username = sender.UserName, knownAs = sender.KnownAs});
                }
            }

            _unitOfWork.messageRepository.AddMessage(message);

            if(await _unitOfWork.Complete())
            {
                //Sending group message through the client
                await Clients.Group(groupName).SendAsync("NewMessage",
                 _mapper.Map<MessageDto>(message));
            } 
        }

        //Setting the Group Name For messages between users
        private string GetGroupName(string caller, string other)
        {

            //Comparing strings to put longer name first for group name
            var stringCompare = string.CompareOrdinal(caller, other) < 0;
            return stringCompare ? $"{caller}-{other}" : $"{other}-{caller}";
        }


    }
}