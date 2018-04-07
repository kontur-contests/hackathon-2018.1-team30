using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Cowl.Backend.Core;
using Cowl.Backend.Hubs;
using Cowl.Backend.Service;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace Cowl.Backend
{
    public class Startup
    {
        // This method gets called by the runtime. Use this method to add services to the container.
        // For more information on how to configure your application, visit https://go.microsoft.com/fwlink/?LinkID=398940
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddCors();
            services.AddSignalR(configure => { });
            services.AddLogging(builder => builder.AddConsole());

            services.AddSingleton<GameService>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseCors(conf => conf.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin().Build());
            app.UseSignalR(configure => { configure.MapHub<GameHub>("/game"); });
        }
    }
}