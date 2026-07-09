import type {
  ExtensionContextValue,
  RoleId,
} from "@stripe/ui-extension-sdk/utils";

export function hasRole(
  userContext: ExtensionContextValue["userContext"],
  roleId: RoleId,
): boolean {
  return (
    userContext?.roles?.some((role) => role.id === roleId) ?? false
  );
}
