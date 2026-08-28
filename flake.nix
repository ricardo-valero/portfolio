{
  description = "Interactive resume: one typed data source, several views, a PDF target";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs =
    { nixpkgs, flake-utils, ... }:
    flake-utils.lib.eachDefaultSystem (
      system:
      let
        pkgs = import nixpkgs { inherit system; };
      in
      {
        devShells.default = pkgs.mkShell {
          packages = [
            pkgs.nodejs_22
            pkgs.playwright-driver.browsers
          ];

          # `npm run pdf` drives the built site through headless Chromium.
          # Point Playwright at the Nix-provided browsers instead of letting it
          # download its own into ~/.cache, which would defeat the point.
          env = {
            PLAYWRIGHT_BROWSERS_PATH = "${pkgs.playwright-driver.browsers}";
            PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS = "true";
          };

          shellHook = ''
            echo "portfolio: node $(node --version)"
          '';
        };
      }
    );
}
