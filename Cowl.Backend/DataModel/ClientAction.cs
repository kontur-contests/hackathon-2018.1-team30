using System;

namespace Cowl.Backend.DataModel
{
    public interface IClientAction
    {
    }

    public class PlayerdMove : IClientAction
    {
        public Guid PlayerId { get; set; }
        public ObjectPosition To { get; set; }
    }

    public class FowlMove : IClientAction
    {
        public Guid FowlId { get; set; }
        public ObjectPosition To { get; set; }
    }

    public class PlayerConnected : IClientAction
    {
        public Guid PlayerId { get; set; }
        public string Name { get; set; }
        public ObjectPosition Position { get; set; }
    }

    public class PlayerDisconnected : IClientAction
    {
        public Guid PlayerId { get; set; }
    }
}