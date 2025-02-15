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

namespace ASC.Web.Core.WhiteLabel;

public class CompanyWhiteLabelSettingsWrapper
{
    public CompanyWhiteLabelSettings Settings { get; set; }
}

[Serializable]
public class CompanyWhiteLabelSettings : ISettings<CompanyWhiteLabelSettings>
{
    public CoreSettings CoreSettings;

    public string CompanyName { get; set; }

    public string Site { get; set; }

    public string Email { get; set; }

    public string Address { get; set; }

    public string Phone { get; set; }

    [JsonPropertyName("IsLicensor")]
    public bool IsLicensor { get; set; }

    public CompanyWhiteLabelSettings(CoreSettings coreSettings)
    {
        CoreSettings = coreSettings;
    }

    public CompanyWhiteLabelSettings()
    {

    }

    #region ISettings Members

    [JsonIgnore]
    public Guid ID
    {
        get { return new Guid("{C3C5A846-01A3-476D-A962-1CFD78C04ADB}"); }
    }


    public CompanyWhiteLabelSettings GetDefault()
    {
        var settings = CoreSettings.GetSetting("CompanyWhiteLabelSettings");

        var result = string.IsNullOrEmpty(settings) ? new CompanyWhiteLabelSettings(CoreSettings) : JsonConvert.DeserializeObject<CompanyWhiteLabelSettings>(settings);

        result.CoreSettings = CoreSettings;

        return result;
    }

    #endregion
}

[Scope]
public class CompanyWhiteLabelSettingsHelper
{
    private readonly CoreSettings _coreSettings;
    private readonly SettingsManager _settingsManager;

    public CompanyWhiteLabelSettingsHelper(CoreSettings coreSettings, SettingsManager settingsManager)
    {
        _coreSettings = coreSettings;
        _settingsManager = settingsManager;
    }

    public CompanyWhiteLabelSettings Instance()
    {
        return _settingsManager.LoadForDefaultTenant<CompanyWhiteLabelSettings>();
    }

    public bool IsDefault(CompanyWhiteLabelSettings settings)
    {
        settings.CoreSettings = _coreSettings;
        var defaultSettings = settings.GetDefault();

        return settings.CompanyName == defaultSettings.CompanyName &&
                settings.Site == defaultSettings.Site &&
                settings.Email == defaultSettings.Email &&
                settings.Address == defaultSettings.Address &&
                settings.Phone == defaultSettings.Phone &&
                settings.IsLicensor == defaultSettings.IsLicensor;
    }
}