/// <reference path="./.astro/types.d.ts" />
/// <reference path="./worker-configuration.d.ts" />

type HaloSession = import("@halo/auth").Session;

declare namespace App {
  interface Locals {
    /** Set by src/middleware.ts on every page request. */
    user: HaloSession["user"] | null;
    session: HaloSession["session"] | null;
  }
}
