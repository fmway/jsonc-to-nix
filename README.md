# JSONC to Nix

A web app to quickly convert JSONC to Nix values. And yes I now know there is [a built-in](https://noogle.dev/f/builtins/fromJSON) for that. But it only support JSON, not JSONC😊...

## Development

```sh
git clone https://github.com/fmway/jsonc-to-nix.git
cd jsonc-to-nix
pnpm install
pnpm dev
```

## Alternative
If you want to use nix expression instead of web app, you can use this code:
```nix
let
  fromJSONC = jsonc:
    builtins.fromJSON (
      builtins.readFile (
        pkgs.runCommand "from-jsonc"
          {
            FILE = pkgs.writeText "file.jsonc" jsonc;
            allowSubstitutes = false;
            preferLocalBuild = true;
          }
          ''
            # it's awkward, but it's works 😏
            ${pkgs.gcc}/bin/cpp -P -E "$FILE" > $out
            # or clang
          ''
      )
    );
in
fromJSONC ''
{
  "just": {
    "work": /* it must'be work, don't use comma in last value */ true
  }
}
''
# or
# fromJSONC (builtins.readFile ./your-file.jsonc)
```
(reference: https://stackoverflow.com/a/77493974)

## Thanks To
- [uncenter](https://github.com/uncenter)

## Related Project
- [json-to-nix](https://json-to-nix.pages.dev/) (the original project)

## License

[MIT](LICENSE)
