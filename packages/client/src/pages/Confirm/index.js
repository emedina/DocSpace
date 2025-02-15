import React, { lazy } from "react";
import { Switch, Route } from "react-router-dom";
import ConfirmRoute from "../../helpers/confirmRoute";

const ActivateUserForm = lazy(() => import("./sub-components/activateUser"));
const CreateUserForm = lazy(() => import("./sub-components/createUser"));
const ChangePasswordForm = lazy(() =>
  import("./sub-components/changePassword")
);
const ActivateEmailForm = lazy(() => import("./sub-components/activateEmail"));
const ChangeEmailForm = lazy(() => import("./sub-components/changeEmail"));
const ChangePhoneForm = lazy(() => import("./sub-components/changePhone"));
const ProfileRemoveForm = lazy(() => import("./sub-components/profileRemove"));
const ChangeOwnerForm = lazy(() => import("./sub-components/changeOwner"));
const TfaAuthForm = lazy(() => import("./sub-components/tfaAuth"));
const TfaActivationForm = lazy(() => import("./sub-components/tfaActivation"));
const RemovePortal = lazy(() => import("./sub-components/removePortal"));
const DeactivatePortal = lazy(() =>
  import("./sub-components/deactivatePortal")
);
const ContinuePortal = lazy(() => import("./sub-components/continuePortal"));
const Auth = lazy(() => import("./sub-components/auth"));
const Error404 = lazy(() => import("../Errors/404"));

const Confirm = () => {
  //console.log("Confirm render");
  const path = "/confirm";
  return (
    <Switch>
      <ConfirmRoute
        forUnauthorized
        path={`${path}/EmpInvite`}
        component={CreateUserForm}
      />
      <ConfirmRoute
        forUnauthorized
        path={`${path}/LinkInvite`}
        component={CreateUserForm}
      />
      <ConfirmRoute
        forUnauthorized
        path={`${path}/Activation`}
        component={ActivateUserForm}
      />
      <ConfirmRoute
        exact
        path={`${path}/EmailActivation`}
        component={ActivateEmailForm}
      />
      <ConfirmRoute
        exact
        path={`${path}/EmailChange`}
        component={ChangeEmailForm}
      />
      <ConfirmRoute
        forUnauthorized
        path={`${path}/PasswordChange`}
        component={ChangePasswordForm}
      />
      <ConfirmRoute
        exact
        path={`${path}/ProfileRemove`}
        component={ProfileRemoveForm}
      />
      <ConfirmRoute
        exact
        path={`${path}/PhoneActivation`}
        component={ChangePhoneForm}
      />
      <ConfirmRoute
        exact
        path={`${path}/PortalOwnerChange`}
        component={ChangeOwnerForm}
      />
      <ConfirmRoute exact path={`${path}/TfaAuth`} component={TfaAuthForm} />
      <ConfirmRoute
        exact
        path={`${path}/TfaActivation`}
        component={TfaActivationForm}
      />
      <ConfirmRoute
        exact
        path={`${path}/PortalRemove`}
        component={RemovePortal}
      />
      <ConfirmRoute
        exact
        path={`${path}/PortalSuspend`}
        component={DeactivatePortal}
      />
      <ConfirmRoute
        exact
        path={`${path}/PortalContinue`}
        component={ContinuePortal}
      />
      <ConfirmRoute forUnauthorized path={`${path}/Auth`} component={Auth} />

      <Route component={Error404} />
    </Switch>
  );
};

export default Confirm;
