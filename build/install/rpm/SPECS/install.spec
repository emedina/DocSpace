%install
rm -rf %{buildroot} 
mkdir -p "%{buildroot}%{_bindir}/"
mkdir -p "%{buildroot}%{_docdir}/%{name}-%{version}-%{release}/"
mkdir -p "%{buildroot}%{_sysconfdir}/logrotate.d"
mkdir -p "%{buildroot}%{_sysconfdir}/nginx/conf.d/"
mkdir -p "%{buildroot}%{_sysconfdir}/nginx/includes/"
mkdir -p "%{buildroot}%{_sysconfdir}/onlyoffice/%{product}/.private/"
mkdir -p "%{buildroot}%{_var}/log/onlyoffice/%{product}/"
mkdir -p "%{buildroot}%{buildpath}/Tools/radicale/plugins/"
mkdir -p "%{buildroot}%{buildpath}/products/ASC.Files/client/"
mkdir -p "%{buildroot}%{buildpath}/products/ASC.Files/editor/"
mkdir -p "%{buildroot}%{buildpath}/products/ASC.Files/server/DocStore/"
mkdir -p "%{buildroot}%{buildpath}/products/ASC.Files/service/"
mkdir -p "%{buildroot}%{buildpath}/products/ASC.People/client/"
mkdir -p "%{buildroot}%{buildpath}/products/ASC.People/server/"
mkdir -p "%{buildroot}%{buildpath}/services/ASC.ApiSystem/"
mkdir -p "%{buildroot}%{buildpath}/services/ASC.ClearEvents/"
mkdir -p "%{buildroot}%{buildpath}/services/ASC.Data.Backup.BackgroundTasks/"
mkdir -p "%{buildroot}%{buildpath}/services/ASC.Data.Backup/"
mkdir -p "%{buildroot}%{buildpath}/services/ASC.Migration.Runner/"
mkdir -p "%{buildroot}%{buildpath}/services/ASC.Notify/"
mkdir -p "%{buildroot}%{buildpath}/services/ASC.Socket.IO/"
mkdir -p "%{buildroot}%{buildpath}/services/ASC.SsoAuth/"
mkdir -p "%{buildroot}%{buildpath}/services/ASC.Studio.Notify/"
mkdir -p "%{buildroot}%{buildpath}/services/ASC.Web.HealthChecks.UI/"
mkdir -p "%{buildroot}%{buildpath}/studio/ASC.Web.Api/"
mkdir -p "%{buildroot}%{buildpath}/studio/ASC.Web.Studio/"
mkdir -p "%{buildroot}%{buildpath}/public/"
mkdir -p "%{buildroot}%{buildpath}/client/"
mkdir -p "%{buildroot}%{buildpath}/products/ASC.Login/login/"
mkdir -p "%{buildroot}/usr/lib/systemd/system/"
mkdir -p "%{buildroot}/%{_var}/www/onlyoffice/Data"
cp -rf %{_builddir}/%{sourcename}/LICENSE "%{buildroot}%{_docdir}/%{name}-%{version}-%{release}/"
cp -rf %{_builddir}/%{sourcename}/README.md "%{buildroot}%{_docdir}/%{name}-%{version}-%{release}/"
cp -rf %{_builddir}/%{sourcename}/ASC.Migration.Runner/service/* "%{buildroot}%{buildpath}/services/ASC.Migration.Runner/"
cp -rf %{_builddir}/%{sourcename}/build/deploy/editor/* "%{buildroot}%{buildpath}/products/ASC.Files/editor/"
cp -rf %{_builddir}/%{sourcename}/build/deploy/public/* "%{buildroot}%{buildpath}/public/"
cp -rf %{_builddir}/%{sourcename}/build/deploy/client/* "%{buildroot}%{buildpath}/client/"
cp -rf %{_builddir}/%{sourcename}/build/deploy/login/* "%{buildroot}%{buildpath}/products/ASC.Login/login/"
cp -rf %{_builddir}/%{sourcename}/build/install/RadicalePlugins/* "%{buildroot}%{buildpath}/Tools/radicale/plugins/"
cp -rf %{_builddir}/%{sourcename}/build/install/common/%{product}-configuration "%{buildroot}%{_bindir}/"
cp -rf %{_builddir}/%{sourcename}/build/install/common/systemd/modules/* "%{buildroot}/usr/lib/systemd/system/"
cp -rf %{_builddir}/%{sourcename}/build/install/common/logrotate/product-common "%{buildroot}%{_sysconfdir}/logrotate.d/%{product}-common"
cp -rf %{_builddir}/%{sourcename}/config/* "%{buildroot}%{_sysconfdir}/onlyoffice/%{product}/"
cp -rf %{_builddir}/%{sourcename}/config/nginx/includes/onlyoffice*.conf "%{buildroot}%{_sysconfdir}/nginx/includes/"
cp -rf %{_builddir}/%{sourcename}/config/nginx/onlyoffice*.conf "%{buildroot}%{_sysconfdir}/nginx/conf.d/"
cp -rf %{_builddir}/%{sourcename}/products/ASC.Files/Server/DocStore/* "%{buildroot}%{buildpath}/products/ASC.Files/server/DocStore/"
cp -rf %{_builddir}/%{sourcename}/publish/products/ASC.Files/server/* "%{buildroot}%{buildpath}/products/ASC.Files/server/"
cp -rf %{_builddir}/%{sourcename}/publish/products/ASC.People/server/* "%{buildroot}%{buildpath}/products/ASC.People/server/"
cp -rf %{_builddir}/%{sourcename}/publish/services/ASC.ApiSystem/service/* "%{buildroot}%{buildpath}/services/ASC.ApiSystem/"
cp -rf %{_builddir}/%{sourcename}/publish/services/ASC.ClearEvents/service/* "%{buildroot}%{buildpath}/services/ASC.ClearEvents/"
cp -rf %{_builddir}/%{sourcename}/publish/services/ASC.Data.Backup.BackgroundTasks/service/* "%{buildroot}%{buildpath}/services/ASC.Data.Backup.BackgroundTasks/"
cp -rf %{_builddir}/%{sourcename}/publish/services/ASC.Data.Backup/service/* "%{buildroot}%{buildpath}/services/ASC.Data.Backup/"
cp -rf %{_builddir}/%{sourcename}/publish/services/ASC.Files.Service/service/* "%{buildroot}%{buildpath}/products/ASC.Files/service/"
cp -rf %{_builddir}/%{sourcename}/publish/services/ASC.Notify/service/* "%{buildroot}%{buildpath}/services/ASC.Notify/"
cp -rf %{_builddir}/%{sourcename}/publish/services/ASC.Socket.IO/service/* "%{buildroot}%{buildpath}/services/ASC.Socket.IO/"
cp -rf %{_builddir}/%{sourcename}/publish/services/ASC.SsoAuth/service/* "%{buildroot}%{buildpath}/services/ASC.SsoAuth/"
cp -rf %{_builddir}/%{sourcename}/publish/services/ASC.Studio.Notify/service/* "%{buildroot}%{buildpath}/services/ASC.Studio.Notify/"
cp -rf %{_builddir}/%{sourcename}/publish/services/ASC.Web.Api/service/* "%{buildroot}%{buildpath}/studio/ASC.Web.Api/"
cp -rf %{_builddir}/%{sourcename}/publish/services/ASC.Web.HealthChecks.UI/service/* "%{buildroot}%{buildpath}/services/ASC.Web.HealthChecks.UI/"
cp -rf %{_builddir}/%{sourcename}/publish/services/ASC.Web.Studio/service/* "%{buildroot}%{buildpath}/studio/ASC.Web.Studio/"
