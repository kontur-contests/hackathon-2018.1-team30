using Cowl.Backend.DataModel;

namespace Cowl.Backend.Core
{
    public interface IActionApplicator<T> where T : IGameAction
    {
        void Apply(Map map, T action);
    }
}