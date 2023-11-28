{ pkgs }: {
  deps = [
    pkgs.minify
    pkgs.nodePackages.vscode-langservers-extracted
    pkgs.nodePackages.typescript-language-server  
  ];
}