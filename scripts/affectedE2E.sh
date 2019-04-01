#!/usr/bin/env bash

git_changes=()
#git_changes=(start-process-cloud.service.spec.ts start-process-cloud.service.ts ../alfresco-ng2-components/lib/process-services-cloud/src/lib/process/people-cloud.component.ts start-task-cloud.service.ts claim-task.directive.ts claim-task.directive.spec.ts)

if [[ "$1" == '--uncommitted' ]];
then
	git_changes_singleline+=("$(git diff --name-only )")
elif [[ "$1" == "--branch" ]];
then
    SHA_CURRENT=("$(git merge-base origin/$2 HEAD )")
    git_changes_singleline+=("$(git diff --name-only $SHA_CURRENT HEAD )")
elif [[ "$1" == "--sha" ]];
then
    git_changes_singleline+=("$(git diff --name-only $2 31658c0 )")
fi

# transform fileList changes from single line with new line into array
for i in "${git_changes_singleline[@]}"; do
 git_changes+=(`echo ${i//'\n'/$'\n'}`)
done

echo "Git log"
echo "====================================="
for i in "${git_changes[@]}"; do
echo "$i";
done
echo "====================================="

component_array=()
service_array=()
page_array=()
page_camelcase_array=("Mock")
e2e_array=()
for i in "${git_changes[@]}"; do
echo "Analize : $i";
if [[ "$i" == *.service.ts ]];
then
    echo "isService: $i"
    service_array+=($i)
elif [[ "$i" == *.component.html ]];
then
	echo "isHTML: $i";
    nameReplaceHTML=(`echo $i  | sed 's/\html/ts/g'`)
    component_array+=($nameReplaceHTML)
elif [[ "$i" == *.component.ts ]];
then
	echo "isComponent: $i";
	component_array+=($i)
elif [[ "$i" == *.page.ts ]];
then
	echo "isPage: $i";
	page_array+=($i)
elif [[ "$i" == *.e2e.ts ]];
then
	echo "isE2E: $i";
	e2e_array+=($i,)
else
	echo "No match: $i";
fi
done

serviceLen=${#service_array[@]}
if [[ "$serviceLen" > 0 ]];
then
    echo ""
    echo "Services: Find affected Components"
    for originalServiceName in "${service_array[@]}"; do
        serviceName="$(node ./scripts/affectedClassName.js $originalServiceName)"

        findComponentType="component"
        findComponentFolder="./lib/process-services-cloud/"
        resultComponent="$(node ./scripts/affectedFilesByImport.js $findComponentType $findComponentFolder $serviceName)"
        # split resultComponent in case contains more occurrences!!
        resultComponentReplaceComma=($(echo $resultComponent | tr ',' "\n"))

        # merge the array
        for element in "${resultComponentReplaceComma[@]}"; do
            echo "-"$element
            component_array+=($element)
        done
    done
fi

# echo "Component affected by services or html"
# for i in "${component_array[@]}"; do
#  echo "-$i"
# done

# find Wrapping Components
componentLen=${#component_array[@]}
if [[ "$componentLen" > 0 ]];
then
    echo ""
    component_extended=""
    echo "Component: Find wrapping Component of:" $component_array
    for originalComponentName in "${component_array[@]}"; do
        # fetch selector
        selectorName="$(node ./scripts/affectedClassSelectorName.js $originalComponentName)"
        selectorNameNoTilde=`echo $selectorName  | sed "s/'//g"`
        echo $originalComponentName" has selector: "$selectorNameNoTilde
        # check html contains selector
        path="lib"
        component_extended+=("$(grep  "</$selectorNameNoTilde>"  -lr --include="*.component.html"  $path)")
    done

    # replace .html to .ts
    for componentNameHTML in "${component_extended[@]}"; do
        wrapperComponentTs=`echo $componentNameHTML  | sed 's/\.html/.ts/g'`
        component_array+=($(echo $wrapperComponentTs | tr ',' "\n"))
    done
fi

for i in "${component_array[@]}"; do
    echo "-$i"
done

componentLen=${#component_array[@]}
if [[ "$componentLen" > 0 ]];
then
    echo ""
    echo "Components: Find affected Pages"

    for originalComponentName in "${component_array[@]}"; do
    componentClassName="$(node ./scripts/affectedClassName.js $originalComponentName)"
    classNameWithoutComponent=(`echo $componentClassName  | rev | cut -c10- | rev`)
    # mapping component to Page
    namePageComponent=$classNameWithoutComponent'Page'
    echo "$componentClassName has the page: $namePageComponent";
    page_camelcase_array+=,$namePageComponent
    done
fi


# find Wrapping Pages
pageCamelLen=${#page_camelcase_array[@]}
if [[ "$pageCamelLen" > 0 ]];
then
    echo ""
    echo "Page: Find wrapping Pages of:" $page_camelcase_array
    findType="page"
    findFolder="lib/testing/src/lib/"
    echo "node ./scripts/affectedFilesByImport.js $findType $findFolder $page_camelcase_array"
    page_extended+="$(node ./scripts/affectedFilesByImport.js $findType $findFolder $page_camelcase_array)"
    for originalPageName in "${page_extended[@]}"; do
        echo "node ./scripts/affectedClassName.js $originalPageName"
        extendPageClassName="$(node ./scripts/affectedClassName.js $originalPageName)"
        echo "$originalPageName has the page: $extendPageClassName";
        page_camelcase_array+=,$extendPageClassName
    done
    echo "PageCamelCase: "$page_camelcase_array
fi

pageLen=${#page_array[@]}
if [[ "$pageLen" > 0 ]];
then
    echo ""
    echo "Page: Convert to camel case"
    for originalPageName in "${page_array[@]}"; do
        # echo "Original: "$originalPageName
        # remove dir
        namePageWithoutPath=(`echo $originalPageName | sed -r 's/.+\/(.+)\..+/\1/'`)
        # echo "Remove dir: "$namePageWithoutPath
        namePageReplaceDot=(`echo $namePageWithoutPath  | sed 's/\./-/g'`)
        namePageCamelcase=(`echo $namePageReplaceDot | sed -re 's~(^|-)(.)~\U\2~g'`)
        # echo "CamelCase: "$namePageCamelcase
        page_camelcase_array+=,$namePageCamelcase
        echo "PageCamelCase: "$page_camelcase_array
    done
fi

pageCamelLen=${#page_camelcase_array[@]}
if [[ "$pageCamelLen" > 0 ]];
then
    echo ""
    echo "Page: Find affected E2E"
    findType="e2e"
    findFolder="./e2e-example/"
    echo "node ./scripts/affectedFilesByImport.js $findType $findFolder $page_camelcase_array"
    e2e_array+="$(node ./scripts/affectedFilesByImport.js $findType $findFolder $page_camelcase_array)"
    echo $e2e_array
fi

# echo "e2e_array affected by services or html"
# for i in "${e2e_array[@]}"; do
#  echo "-$i"
# done

e2eLen=${#e2e_array[@]}
if [[ "$e2eLen" > 0 ]];
then
    echo ""
    #echo "e2e affected: "$e2e_array
    componentReplaceComma=(`echo $e2e_array  | sed 's/\,/ /g'`)
    echo "E2e to run"
    for i in "${componentReplaceComma[@]}"; do
    echo "-$i"
    done
else
    echo "No E2E affected!"
fi
