rd="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
echo "Run script directory:" $dir

dir=$(builtin cd $rd/../; pwd)

echo "Root directory:" $dir

dotnet test $dir/common/Tests/Frontend.Translations.Tests/Frontend.Translations.Tests.csproj --filter "TestCategory=Locales" -l:html --results-directory "$dir/TestsResults" --environment "BASE_DIR=$dir"