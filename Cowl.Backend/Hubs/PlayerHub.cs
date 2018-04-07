using System.Threading.Tasks;
using Cowl.Backend.DataModel;
using Cowl.Backend.Service;
using Newtonsoft.Json;
using Microsoft.AspNetCore.SignalR;

namespace Cowl.Backend.Hubs
{
    public class PlayerHub : Hub
    {
        private readonly GameService _gameService;

        public PlayerHub(GameService gameService)
        {
            _gameService = gameService;
        }

        public async Task Move(string str)
        {
            var direction = JsonConvert.DeserializeObject<MoveDirection>(str);

            var player = await _gameService.GetPlayer(Clients.Caller);
            player.Move(direction);

            await Clients.All.SendAsync("state", player);
        }
    }
}