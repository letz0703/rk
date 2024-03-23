# Data Fetching

## cache

    https://youtu.be/vCOSTG10Y4o?t=8460
    don't want cache
    await fetch("https://....", {cache: "force-cache"}) to {cache: "no-store"}
    why? fresh data.

### cache interval

    {next:{revaludate:3600}}

# path name 2024.03.20 수

hooks
useRouter(), usePatname(), useSearchParams()
https://youtu.be/vCOSTG10Y4o?t=8111
const q= useSearchParms().get("q")

# navigation

https://youtu.be/vCOSTG10Y4o?t=7852
useRouter hook

### pre fetch

<Linkkhref="" prefetch={false}>

# Not Use SSR (Serverside Rendering)

https://youtu.be/vCOSTG10Y4o?t=7409

const HydrationTestNoSSR = dynamic(() => import("@/components/hydrationTest"), {
ssr: false
})

2024.03.11/월
snippet 생성
divv

```
className": {
  "prefix": "divv",
  "body": ["<div className='{styles.$1}'>$2</div>"],
  "description": "class name 24"
},
```

[git](https://github.com/safak/next14-tutorial)

2024.03.10/일
이미지 색상 변경 : filter: grayscale(1)
https://css-tricks.com/almanac/properties/f/filter/

####### shortcuts
cmdK+cmdD : go to source definition
2024.03.07/목 external image

####### snippet
2024.03.07/목 imgg nextJs <Img src="" fill/>
"imgg": {
"prefix": "imggg",
"body": [
"<Image src=\"${1}.${2|jpg,png|}\" alt=\"\" fill className={styles.${1}Img}/>"
],
"description": "Insert an image with .jpg or .png extension"
},
