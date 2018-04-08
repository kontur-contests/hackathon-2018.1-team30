using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using Cowl.Backend.DataModel;
using Cowl.Backend.DataModel.GameObjects;

namespace Cowl.Backend.Service
{
    public class GameStorageService
    {
        public ConcurrentDictionary<string, Player> Players { get; } = new ConcurrentDictionary<string, Player>();

        public ConcurrentDictionary<string, GameObject> GameObjects { get; } =
            new ConcurrentDictionary<string, GameObject>();

        public IEnumerable<GameObject> AllGameObjects => GameObjects.Select(kv => kv.Value);

        public IEnumerable<Player> AllPlayers =>
            AllGameObjects.Where(go => go.Type == GameObjectType.Player).Select(p => p as Player);

        public IEnumerable<Shit> AllShits => AllGameObjects.Where(go => go.Type == GameObjectType.Shit)
            .Select(p => p as Shit);

        public IEnumerable<Fowl> AllFowls =>
            AllGameObjects.Where(go => go.Type == GameObjectType.Fowl).Select(p => p as Fowl);

        public void AddGameObject(GameObject gameObject)
        {
            GameObjects.TryAdd(gameObject.Id, gameObject);
        }

        public void AddRangeGameObject(IEnumerable<GameObject> gameObjects)
        {
            foreach (var gameObject in gameObjects)
            {
                AddGameObject(gameObject);
            }
        }

        public GameObject RemoveGameObject(string gameObjectId)
        {
            GameObjects.TryRemove(gameObjectId, out var result);
            return result;
        }

        public GameObject GetGameObject(string gameObjectId)
        {
            GameObjects.TryGetValue(gameObjectId, out var result);
            return result;
        }
    }
}