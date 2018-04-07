using Cowl.Backend.Schedule.Job;

namespace Cowl.Backend.Schedule
{
    internal class JobRegistry : FluentScheduler.Registry
    {
        public JobRegistry()
        {
            // simple repeated jobs
            Schedule<SpawnFowlJob>().ToRunNow().AndEvery(100).Milliseconds();
        }
    }
}