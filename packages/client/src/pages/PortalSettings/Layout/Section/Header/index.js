﻿import DeleteReactSvgUrl from "PUBLIC_DIR/images/delete.react.svg?url";
import ArrowPathReactSvgUrl from "PUBLIC_DIR/images/arrow.path.react.svg?url";
import ActionsHeaderTouchReactSvgUrl from "PUBLIC_DIR/images/actions.header.touch.react.svg?url";
import React from "react";
import { inject, observer } from "mobx-react";
import styled, { css } from "styled-components";
import { withRouter } from "react-router";
import { withTranslation } from "react-i18next";
import Headline from "@docspace/common/components/Headline";
import IconButton from "@docspace/components/icon-button";
import TableGroupMenu from "@docspace/components/table-container/TableGroupMenu";
import DropDownItem from "@docspace/components/drop-down-item";
import LoaderSectionHeader from "../loaderSectionHeader";
import { tablet } from "@docspace/components/utils/device";
import withLoading from "SRC_DIR/HOCs/withLoading";
import Badge from "@docspace/components/badge";
import {
  getKeyByLink,
  settingsTree,
  getTKeyByKey,
  checkPropertyByLink,
} from "../../../utils";
import { combineUrl } from "@docspace/common/utils";
import { isMobile, isTablet, isMobileOnly } from "react-device-detect";

const HeaderContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  max-width: calc(100vw - 32px);
  .settings-section_header {
    display: flex;
    align-items: baseline;
    .settings-section_badge {
      margin-left: 8px;
      cursor: auto;
    }

    .header {
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }
  }
  .action-wrapper {
    flex-grow: 1;

    .action-button {
      margin-left: auto;
    }
  }

  .arrow-button {
    margin-right: 12px;

    @media ${tablet} {
      padding: 8px 0 8px 8px;
      margin-left: -8px;
    }
  }

  ${isTablet &&
  css`
    h1 {
      line-height: 61px;
      font-size: 21px;
    }
  `};

  @media (min-width: 600px) and (max-width: 1024px) {
    h1 {
      line-height: 61px;
      font-size: 21px;
    }
  }

  @media (min-width: 1024px) {
    h1 {
      font-size: 18px;
      line-height: 59px !important;
    }

    .settings-section_header {
      padding-top: 6px;
    }
  }
`;

const StyledContainer = styled.div`
  .group-button-menu-container {
    ${(props) =>
      props.viewAs === "table"
        ? css`
            margin: 0px -20px;
            width: calc(100% + 40px);
          `
        : css`
            margin: 0px -20px;
            width: calc(100% + 40px);
          `}

    @media ${tablet} {
      margin: 0 -16px;
      width: calc(100% + 32px);
    }

    ${isMobile &&
    css`
      margin: 0 -16px;
      width: calc(100% + 32px);
    `}

    ${isMobileOnly &&
    css`
      margin: 0 -16px;
      width: calc(100% + 32px);
    `}
  }
`;

class SectionHeaderContent extends React.Component {
  constructor(props) {
    super(props);

    const { match, location } = props;
    const fullSettingsUrl = match.url;
    const locationPathname = location.pathname;

    const fullSettingsUrlLength = fullSettingsUrl.length;

    const resultPath = locationPathname.slice(fullSettingsUrlLength + 1);
    const arrayOfParams = resultPath.split("/");

    const key = getKeyByLink(arrayOfParams, settingsTree);
    let currKey = key.length > 3 ? key : key[0];
    if (key === "8" || key === "8-0") currKey = "8-0";

    const header = getTKeyByKey(currKey, settingsTree);
    const isCategory = checkPropertyByLink(
      arrayOfParams,
      settingsTree,
      "isCategory"
    );
    const isHeader = checkPropertyByLink(
      arrayOfParams,
      settingsTree,
      "isHeader"
    );

    this.state = {
      header,
      isCategoryOrHeader: isCategory || isHeader,
      showSelector: false,
      isHeaderVisible: false,
    };
  }

  isAvailableSettings = (key) => {
    const {
      isBrandingAndCustomizationAvailable,
      isRestoreAndAutoBackupAvailable,
    } = this.props;

    switch (key) {
      case "DNSSettings":
        return isBrandingAndCustomizationAvailable;
      case "RestoreBackup":
        return isRestoreAndAutoBackupAvailable;
      default:
        return true;
    }
  };
  componentDidUpdate() {
    const { tReady, setIsLoadedSectionHeader } = this.props;

    if (tReady) setIsLoadedSectionHeader(true);

    const arrayOfParams = this.getArrayOfParams();

    const key = getKeyByLink(arrayOfParams, settingsTree);
    let currKey = key.length > 3 ? key : key[0];

    if (key === "8" || key === "8-0") currKey = "8-0";

    const header = getTKeyByKey(currKey, settingsTree);
    const isCategory = checkPropertyByLink(
      arrayOfParams,
      settingsTree,
      "isCategory"
    );
    const isHeader = checkPropertyByLink(
      arrayOfParams,
      settingsTree,
      "isHeader"
    );
    const isCategoryOrHeader = isCategory || isHeader;

    const isNeedPaidIcon = !this.isAvailableSettings(header);

    this.state.isNeedPaidIcon !== isNeedPaidIcon &&
      this.setState({ isNeedPaidIcon });

    header !== this.state.header && this.setState({ header });

    isCategoryOrHeader !== this.state.isCategoryOrHeader &&
      this.setState({ isCategoryOrHeader });
  }

  onBackToParent = () => {
    let newArrayOfParams = this.getArrayOfParams();
    newArrayOfParams.splice(-1, 1);
    const newPath = "/portal-settings/" + newArrayOfParams.join("/");
    this.props.history.push(
      combineUrl(window.DocSpaceConfig?.proxy?.url, newPath)
    );
  };

  getArrayOfParams = () => {
    const { match, location } = this.props;
    const fullSettingsUrl = match.url;
    const locationPathname = location.pathname;

    const fullSettingsUrlLength = fullSettingsUrl.length;
    const resultPath = locationPathname.slice(fullSettingsUrlLength + 1);
    const arrayOfParams = resultPath.split("/").filter((param) => {
      return param !== "filter";
    });
    return arrayOfParams;
  };

  addUsers = (items) => {
    const { addUsers } = this.props;
    if (!addUsers) return;
    addUsers(items);
  };

  onToggleSelector = (isOpen = !this.props.selectorIsOpen) => {
    const { toggleSelector } = this.props;
    toggleSelector(isOpen);
  };

  onClose = () => {
    const { deselectUser } = this.props;
    deselectUser();
  };

  onCheck = (checked) => {
    const { setSelected } = this.props;
    setSelected(checked ? "all" : "close");
  };

  onSelectAll = () => {
    const { setSelected } = this.props;
    setSelected("all");
  };

  removeAdmins = () => {
    const { removeAdmins } = this.props;
    if (!removeAdmins) return;
    removeAdmins();
  };

  render() {
    const {
      t,
      isLoadedSectionHeader,
      addUsers,
      isHeaderIndeterminate,
      isHeaderChecked,
      isHeaderVisible,
      selection,
    } = this.props;
    const { header, isCategoryOrHeader, isNeedPaidIcon } = this.state;
    const arrayOfParams = this.getArrayOfParams();

    const menuItems = (
      <>
        <DropDownItem
          key="all"
          label={t("Common:SelectAll")}
          data-index={1}
          onClick={this.onSelectAll}
        />
      </>
    );

    const headerMenu = [
      {
        label: t("Common:Delete"),
        disabled: !selection || !selection.length > 0,
        onClick: this.removeAdmins,
        iconUrl: DeleteReactSvgUrl,
      },
    ];

    return (
      <StyledContainer isHeaderVisible={isHeaderVisible}>
        {isHeaderVisible ? (
          <div className="group-button-menu-container">
            <TableGroupMenu
              checkboxOptions={menuItems}
              onChange={this.onCheck}
              isChecked={isHeaderChecked}
              isIndeterminate={isHeaderIndeterminate}
              headerMenu={headerMenu}
            />
          </div>
        ) : !isLoadedSectionHeader ? (
          <LoaderSectionHeader />
        ) : (
          <HeaderContainer>
            {!isCategoryOrHeader && arrayOfParams[0] && (
              <IconButton
                iconName={ArrowPathReactSvgUrl}
                size="17"
                isFill={true}
                onClick={this.onBackToParent}
                className="arrow-button"
              />
            )}
            <Headline type="content" truncate={true}>
              <div className="settings-section_header">
                <div className="header"> {t(header)}</div>
                {isNeedPaidIcon ? (
                  <Badge
                    backgroundColor="#EDC409"
                    label={t("Common:Paid")}
                    className="settings-section_badge"
                    isPaidBadge={true}
                  />
                ) : (
                  ""
                )}
              </div>
            </Headline>
            {addUsers && (
              <div className="action-wrapper">
                <IconButton
                  iconName={ActionsHeaderTouchReactSvgUrl}
                  size="17"
                  isFill={true}
                  onClick={this.onToggleSelector}
                  className="action-button"
                />
              </div>
            )}
          </HeaderContainer>
        )}
      </StyledContainer>
    );
  }
}

export default inject(({ auth, setup, common }) => {
  const { currentQuotaStore } = auth;
  const {
    isBrandingAndCustomizationAvailable,
    isRestoreAndAutoBackupAvailable,
  } = currentQuotaStore;
  const { addUsers, removeAdmins } = setup.headerAction;
  const { toggleSelector } = setup;
  const {
    selected,
    setSelected,
    isHeaderIndeterminate,
    isHeaderChecked,
    isHeaderVisible,
    deselectUser,
    selectAll,
    selection,
  } = setup.selectionStore;
  const { admins, selectorIsOpen } = setup.security.accessRight;
  const { isLoadedSectionHeader, setIsLoadedSectionHeader } = common;
  return {
    addUsers,
    removeAdmins,
    selected,
    setSelected,
    admins,
    isHeaderIndeterminate,
    isHeaderChecked,
    isHeaderVisible,
    deselectUser,
    selectAll,
    toggleSelector,
    selectorIsOpen,
    selection,
    isLoadedSectionHeader,
    setIsLoadedSectionHeader,
    isBrandingAndCustomizationAvailable,
    isRestoreAndAutoBackupAvailable,
  };
})(
  withLoading(
    withRouter(
      withTranslation(["Settings", "Common"])(observer(SectionHeaderContent))
    )
  )
);
