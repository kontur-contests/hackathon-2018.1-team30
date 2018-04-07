using System;
using FluentScheduler;

namespace Cowl.Backend.Schedule
{
    internal class JobFactory : IJobFactory
    {
        private readonly IServiceProvider _services;

        public JobFactory(IServiceProvider services)
        {
            _services = services;
        }

        public IJob GetJobInstance<T>()
            where T : IJob
        {
            return (T) _services.GetService(typeof(T));
        }
    }
}