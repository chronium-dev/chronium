export type BasicUserContext =
  | {
      isBasicUser: true;
      workspaceId: string;
      templateId: string;
    }
  | {
      isBasicUser: false;
    };
