﻿// (c) Copyright Ascensio System SIA 2010-2022
//
// This program is a free software product.
// You can redistribute it and/or modify it under the terms
// of the GNU Affero General Public License (AGPL) version 3 as published by the Free Software
// Foundation. In accordance with Section 7(a) of the GNU AGPL its Section 15 shall be amended
// to the effect that Ascensio System SIA expressly excludes the warranty of non-infringement of
// any third-party rights.
//
// This program is distributed WITHOUT ANY WARRANTY, without even the implied warranty
// of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For details, see
// the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
//
// You can contact Ascensio System SIA at Lubanas st. 125a-25, Riga, Latvia, EU, LV-1021.
//
// The  interactive user interfaces in modified source and object code versions of the Program must
// display Appropriate Legal Notices, as required under Section 5 of the GNU AGPL version 3.
//
// Pursuant to Section 7(b) of the License you must retain the original Product logo when
// distributing the program. Pursuant to Section 7(e) we decline to grant you any rights under
// trademark law for use of our trademarks.
//
// All the Product's GUI elements, including illustrations and icon sets, as well as technical writing
// content are licensed under the terms of the Creative Commons Attribution-ShareAlike 4.0
// International. See the License terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode

var options = new WebApplicationOptions
{
    Args = args,
    ContentRootPath = WindowsServiceHelpers.IsWindowsService() ? AppContext.BaseDirectory : default
};

var builder = WebApplication.CreateBuilder(options);

builder.Configuration.AddJsonFile($"appsettings.runner.json", true)
                .AddCommandLine(args);

builder.Services.AddScoped<EFLoggerFactory>();
builder.Services.AddBaseDbContext<AccountLinkContext>();
builder.Services.AddBaseDbContext<CoreDbContext>();
builder.Services.AddBaseDbContext<TenantDbContext>();
builder.Services.AddBaseDbContext<UserDbContext>();
builder.Services.AddBaseDbContext<TelegramDbContext>();
builder.Services.AddBaseDbContext<FirebaseDbContext>();
builder.Services.AddBaseDbContext<CustomDbContext>();
builder.Services.AddBaseDbContext<WebstudioDbContext>();
builder.Services.AddBaseDbContext<InstanceRegistrationContext>();
builder.Services.AddBaseDbContext<IntegrationEventLogContext>();
builder.Services.AddBaseDbContext<FeedDbContext>();
builder.Services.AddBaseDbContext<WebhooksDbContext>();
builder.Services.AddBaseDbContext<MessagesContext>();
builder.Services.AddBaseDbContext<BackupsContext>();
builder.Services.AddBaseDbContext<FilesDbContext>();
builder.Services.AddBaseDbContext<NotifyDbContext>();
builder.Services.AddBaseDbContext<UrlShortenerFakeDbContext>();
builder.Services.AddBaseDbContext<TeamlabSiteContext>();

var app = builder.Build();

var providersInfo = app.Configuration.GetSection("options").Get<Options>();
var configurationInfo = !string.IsNullOrEmpty(app.Configuration["standalone"]) ? ConfigurationInfo.Standalone : ConfigurationInfo.SaaS;

foreach (var providerInfo in providersInfo.Providers)
{
    var migrationCreator = new MigrationRunner(app.Services);
    migrationCreator.RunApplyMigrations(AppContext.BaseDirectory, providerInfo, providersInfo.TeamlabsiteProviders.SingleOrDefault(q => q.Provider == providerInfo.Provider), configurationInfo);
}
