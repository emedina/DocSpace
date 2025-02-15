// (c) Copyright Ascensio System SIA 2010-2022
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

namespace ASC.Core.Data;

[Scope(Additional = typeof(DbQuotaServiceExtensions))]
class DbQuotaService : IQuotaService
{
    private readonly IDbContextFactory<CoreDbContext> _dbContextFactory;
    private readonly IMapper _mapper;
    public DbQuotaService(IDbContextFactory<CoreDbContext> dbContextManager, IMapper mapper)
    {
        _dbContextFactory = dbContextManager;
        _mapper = mapper;
    }

    public IEnumerable<TenantQuota> GetTenantQuotas()
    {
        using var coreDbContext = _dbContextFactory.CreateDbContext();

        return _mapper.Map<List<DbQuota>, List<TenantQuota>>(coreDbContext.Quotas.ToList());
    }

    public TenantQuota GetTenantQuota(int id)
    {
        using var coreDbContext = _dbContextFactory.CreateDbContext();

        return _mapper.Map<DbQuota, TenantQuota>(coreDbContext.Quotas.SingleOrDefault(r => r.Tenant == id));
    }

    public TenantQuota SaveTenantQuota(TenantQuota quota)
    {
        ArgumentNullException.ThrowIfNull(quota);

        using var coreDbContext = _dbContextFactory.CreateDbContext();
        coreDbContext.AddOrUpdate(coreDbContext.Quotas, _mapper.Map<TenantQuota, DbQuota>(quota));
        coreDbContext.SaveChanges();

        return quota;
    }

    public void RemoveTenantQuota(int id)
    {
        using var coreDbContext = _dbContextFactory.CreateDbContext();
        var strategy = coreDbContext.Database.CreateExecutionStrategy();

        strategy.Execute(async () =>
        {
            using var coreDbContext = _dbContextFactory.CreateDbContext();
            using var tr = await coreDbContext.Database.BeginTransactionAsync();

            await coreDbContext.Quotas
                               .Where(r => r.Tenant == id)
                               .ExecuteDeleteAsync();

            await tr.CommitAsync();
        }).GetAwaiter()
          .GetResult();
    }


    public void SetTenantQuotaRow(TenantQuotaRow row, bool exchange)
    {
        ArgumentNullException.ThrowIfNull(row);

        using var coreDbContext = _dbContextFactory.CreateDbContext();
        var dbTenantQuotaRow = _mapper.Map<TenantQuotaRow, DbQuotaRow>(row);
        dbTenantQuotaRow.UserId = row.UserId;

        var exist = coreDbContext.QuotaRows.Find(new object[] { dbTenantQuotaRow.Tenant, dbTenantQuotaRow.UserId, dbTenantQuotaRow.Path });

        if (exist == null)
        {
            coreDbContext.QuotaRows.Add(dbTenantQuotaRow);
            coreDbContext.SaveChanges();
        }
        else
        {
            if (exchange)
            {
                coreDbContext.QuotaRows
                    .Where(r => r.Path == row.Path && r.Tenant == row.Tenant && r.UserId == row.UserId)
                    .ExecuteUpdate(x => x.SetProperty(p => p.Counter, p => (p.Counter + row.Counter)));
            }
            else
            {
                coreDbContext.AddOrUpdate(coreDbContext.QuotaRows, dbTenantQuotaRow);
                coreDbContext.SaveChanges();
            }
        }
    }

    public IEnumerable<TenantQuotaRow> FindTenantQuotaRows(int tenantId)
    {
        return FindUserQuotaRows(tenantId, Guid.Empty);
    }

    public IEnumerable<TenantQuotaRow> FindUserQuotaRows(int tenantId, Guid userId)
    {
        using var coreDbContext = _dbContextFactory.CreateDbContext();
        var q = coreDbContext.QuotaRows.Where(r => r.UserId == userId);

        if (tenantId != Tenant.DefaultTenant)
        {
            q = q.Where(r => r.Tenant == tenantId);
        }

        return q.ProjectTo<TenantQuotaRow>(_mapper.ConfigurationProvider).ToList();
    }
}

public static class DbQuotaServiceExtensions
{
    public static void Register(DIHelper services)
    {
        services.TryAdd<TenantQuotaPriceResolver>();
    }
}
