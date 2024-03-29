# Snapshot report for `tests/rules/style.test.mjs`

The actual snapshot is saved in `style.test.mjs.snap`.

Generated by [AVA](https://avajs.dev).

## Class Padding

> ### Snapshot 1
> Testing class padding beautification option. The option will place newlines between selectors
> ```js
> {
>   "style": {
>     "classPadding": true
>   }
> }
> ```

    `.a {}␊
    ␊
    .b {}␊
    ␊
    .c {}␊
    ␊
    /* Other Selectors */␊
    ␊
    .selector {␊
      background: #eee;␊
      border-radius: 20px;␊
    }␊
    ␊
    label {␊
      width: 160px;␊
      float: left;␊
      text-align: right;␊
      padding: 4px;␊
      margin-bottom: 20px;␊
    }␊
    ␊
    input {␊
      width: 130px;␊
      float: right;␊
    }␊
    ␊
    label,␊
    input {␊
      font-size: 1em;␊
      line-height: 1.5;␊
    }␊
    ␊
    input[type="checkbox"] {␊
      height: 24px;␊
    }␊
    ␊
    div {␊
      clear: both;␊
    }␊
    ␊
    .errors {␊
      background: yellow;␊
      border-radius: 20px;␊
      box-shadow: 1px 1px 1px black;␊
      padding: 20px;␊
      width: 300px;␊
      position: absolute;␊
      left: 390px;␊
    }`

> ### Snapshot 2
> Testing class padding beautification option. The option will place newlines between selectors
> ```js
> {
>   "style": {
>     "classPadding": false
>   }
> }
> ```

    `.a {}␊
    .b {}␊
    .c {}␊
    ␊
    /* Other Selectors */␊
    ␊
    .selector {␊
      background: #eee;␊
      border-radius: 20px;␊
    }␊
    label {␊
      width: 160px;␊
      float: left;␊
      text-align: right;␊
      padding: 4px;␊
      margin-bottom: 20px;␊
    }␊
    input {␊
      width: 130px;␊
      float: right;␊
    }␊
    label,␊
    input {␊
      font-size: 1em;␊
      line-height: 1.5;␊
    }␊
    input[type="checkbox"] {␊
      height: 24px;␊
    }␊
    div {␊
      clear: both;␊
    }␊
    .errors {␊
      background: yellow;␊
      border-radius: 20px;␊
      box-shadow: 1px 1px 1px black;␊
      padding: 20px;␊
      width: 300px;␊
      position: absolute;␊
      left: 390px;␊
    }`

## Correct

> ### Snapshot 1
> Testing correction option. This rule will do some very mild linting and fix sloppiness in code. The comments will list the applied corrections.
> ```js
> {
>   "style": {
>     "correct": true
>   }
> }
> ```

    `/* Adds a semicolon to the last property (display: flex) */␊
    ␊
    .select {␊
      float: right;␊
      width: 100%;␊
      height: 100%;␊
      display: flex;␊
    }`

> ### Snapshot 2
> Testing correction option. This rule will do some very mild linting and fix sloppiness in code. The comments will list the applied corrections.
> ```js
> {
>   "style": {
>     "correct": false
>   }
> }
> ```

    `/* Adds a semicolon to the last property (display: flex) */␊
    ␊
    .select {␊
      float: right;␊
      width: 100%;␊
      height: 100%;␊
      display: flex␊
    }`

## No Leading Zero

> ### Snapshot 1
> Testing unit based beautification rule which will remove leading zeros `0` from number values. The option will preserve some units (like `%`)
> ```js
> {
>   "style": {
>     "noLeadZero": true
>   }
> }
> ```

    `.selector {␊
      width: 0.1%;␊
      height: .05rem;␊
      font-size: .30em;␊
      padding: .9px;␊
      line-height: 1.10%;␊
    }`

> ### Snapshot 2
> Testing unit based beautification rule which will remove leading zeros `0` from number values. The option will preserve some units (like `%`)
> ```js
> {
>   "style": {
>     "noLeadZero": false
>   }
> }
> ```

    `.selector {␊
      width: 0.1%;␊
      height: 0.05rem;␊
      font-size: 0.30em;␊
      padding: 0.9px;␊
      line-height: 1.10%;␊
    }`

## Quotation Conversion

> ### Snapshot 1
> Testing quote conversions applied to string values
> ```js
> {
>   "style": {
>     "quoteConvert": "single"
>   }
> }
> ```

    `.box {␊
      background-image: url('images/my-background.png');␊
    }␊
    ␊
    .box {␊
      background-image: url('https://www.example.com/images/my-background.png');␊
    }␊
    ␊
    p:lang(en) {␊
      quotes: '\\201C' '\\201D' '\\2018' '\\2019' '\\201C' '\\201D' '\\2018' '\\2019';␊
    }␊
    ␊
    .clip-me {␊
      clip-path: path('M0.5, 1 C0.5, 1, 0, 0.7, 0, 0.3 A0.25, 0.25, 1, 1, 1, 0.5, 0.3 A0.25, 0.25, 1, 1, 1, 1, 0.3 C1, 0.7, 0.5, 1, 0.5, 1 Z');␊
    }␊
    ␊
    .move-me {␊
      offset-path: path('M56.06, 227 ...');␊
    }␊
    ␊
    ␊
    @font-face {␊
      font-family: 'FeltTipPen';␊
      src: local('Felt Tip Pen Web'), /* Full font name */␊
      local('FeltTipPen-Regular'); /* Postscript name */␊
    }␊
    ␊
    .help::before {␊
      content: image('try.webp', 'try.svg', 'try.gif');␊
    }`

> ### Snapshot 2
> Testing quote conversions applied to string values
> ```js
> {
>   "style": {
>     "quoteConvert": "double"
>   }
> }
> ```

    `.box {␊
      background-image: url("images/my-background.png");␊
    }␊
    ␊
    .box {␊
      background-image: url("https://www.example.com/images/my-background.png");␊
    }␊
    ␊
    p:lang(en) {␊
      quotes: "\\201C" "\\201D" "\\2018" "\\2019" "\\201C" "\\201D" "\\2018" "\\2019";␊
    }␊
    ␊
    .clip-me {␊
      clip-path: path("M0.5, 1 C0.5, 1, 0, 0.7, 0, 0.3 A0.25, 0.25, 1, 1, 1, 0.5, 0.3 A0.25, 0.25, 1, 1, 1, 1, 0.3 C1, 0.7, 0.5, 1, 0.5, 1 Z");␊
    }␊
    ␊
    .move-me {␊
      offset-path: path("M56.06, 227 ...");␊
    }␊
    ␊
    ␊
    @font-face {␊
      font-family: "FeltTipPen";␊
      src: local("Felt Tip Pen Web"), /* Full font name */␊
      local("FeltTipPen-Regular"); /* Postscript name */␊
    }␊
    ␊
    .help::before {␊
      content: image("try.webp", "try.svg", "try.gif");␊
    }`

> ### Snapshot 3
> Testing quote conversions applied to string values
> ```js
> {
>   "style": {
>     "quoteConvert": "none"
>   }
> }
> ```

    `.box {␊
      background-image: url("images/my-background.png");␊
    }␊
    ␊
    .box {␊
      background-image: url("https://www.example.com/images/my-background.png");␊
    }␊
    ␊
    p:lang(en) {␊
      quotes: "\\201C" "\\201D" "\\2018" "\\2019" "\\201C" "\\201D" "\\2018" "\\2019";␊
    }␊
    ␊
    .clip-me {␊
      clip-path: path('M0.5, 1 C0.5, 1, 0, 0.7, 0, 0.3 A0.25, 0.25, 1, 1, 1, 0.5, 0.3 A0.25, 0.25, 1, 1, 1, 1, 0.3 C1, 0.7, 0.5, 1, 0.5, 1 Z');␊
    }␊
    ␊
    .move-me {␊
      offset-path: path("M56.06, 227 ...");␊
    }␊
    ␊
    ␊
    @font-face {␊
      font-family: 'FeltTipPen';␊
      src: local('Felt Tip Pen Web'), /* Full font name */␊
      local('FeltTipPen-Regular'); /* Postscript name */␊
    }␊
    ␊
    .help::before {␊
      content: image("try.webp", "try.svg", "try.gif");␊
    }`

## Sort Selectors (Alphabetical)

> ### Snapshot 1
> -
> Test CSS selector sorting. Class selector sorting will be applied in alphabetical order. The first snapshot has sorting enabled, the second snapshot has it disabled.
> ```js
> {
>   "style": {
>     "sortSelectors": true
>   }
> }
> ```

    `.a,␊
    .b,␊
    .c > .d > .x,␊
    .e,␊
    .f,␊
    .g,␊
    .h,␊
    .j,␊
    .k,␊
    .m,␊
    .n,␊
    .o,␊
    .r,␊
    .t > .v > .x,␊
    .u,␊
    .v,␊
    .w,␊
    .x > .a > .b,␊
    .x > .c > .d,␊
    .y,␊
    .z,␊
    .ä,␊
    .ö {␊
      background-image: url("barn.jpg");␊
      z-index: 999;␊
      color: #fff;␊
      width: 200px;␊
      background-repeat: no-repeat;␊
      background-position: right top;␊
      background-attachment: fixed;␊
      font-weight: 100;␊
      font-style: bold: margin-top: 100px;␊
      display: flex;␊
      position: absolute;␊
      float: right;␊
      margin-left: 100px;␊
      padding-right: 25px;␊
      transition: ease-in;␊
      visibility: padding-bottom: 40px;␊
      font-weight: 100;␊
      font-style: bold: padding-left: 25px;␊
      visibility: collapse;␊
      min-inline-size: inherit;␊
    }␊
    ␊
    ␊
    .a,␊
    .b,␊
    .c,␊
    .e,␊
    .f,␊
    .g,␊
    .h,␊
    .j,␊
    .k,␊
    .m,␊
    .n,␊
    .o,␊
    .r,␊
    .t,␊
    .u,␊
    .v,␊
    .w,␊
    .x,␊
    .x,␊
    .y,␊
    .z,␊
    .ä,␊
    .ö {␊
      background-image: url("barn.jpg");␊
      z-index: 999;␊
      color: #fff;␊
      width: 200px;␊
      background-repeat: no-repeat;␊
      background-position: right top;␊
      background-attachment: fixed;␊
      font-weight: 100;␊
      font-style: bold: margin-top: 100px;␊
      display: flex;␊
      position: absolute;␊
      float: right;␊
      margin-left: 100px;␊
      padding-right: 25px;␊
      transition: ease-in;␊
      visibility: padding-bottom: 40px;␊
      font-weight: 100;␊
      font-style: bold: padding-left: 25px;␊
      visibility: collapse;␊
      min-inline-size: inherit;␊
    }`

> ### Snapshot 2
> -
> Test CSS selector sorting. Class selector sorting will be applied in alphabetical order. The first snapshot has sorting enabled, the second snapshot has it disabled.
> ```js
> {
>   "style": {
>     "sortSelectors": false
>   }
> }
> ```

    `.v,␊
    .z,␊
    .y,␊
    .a,␊
    .g,␊
    .u,␊
    .x > .a > .b,␊
    .x > .c > .d,␊
    .c > .d > .x,␊
    .f,␊
    .e,␊
    .n,␊
    .r,␊
    .t > .v > .x,␊
    .w,␊
    .b,␊
    .h,␊
    .j,␊
    .m,␊
    .k,␊
    .o,␊
    .ö,␊
    .ä {␊
      background-image: url("barn.jpg");␊
      z-index: 999;␊
      color: #fff;␊
      width: 200px;␊
      background-repeat: no-repeat;␊
      background-position: right top;␊
      background-attachment: fixed;␊
      font-weight: 100;␊
      font-style: bold: margin-top: 100px;␊
      display: flex;␊
      position: absolute;␊
      float: right;␊
      margin-left: 100px;␊
      padding-right: 25px;␊
      transition: ease-in;␊
      visibility: padding-bottom: 40px;␊
      font-weight: 100;␊
      font-style: bold: padding-left: 25px;␊
      visibility: collapse;␊
      min-inline-size: inherit;␊
    }␊
    ␊
    ␊
    .v,␊
    .z,␊
    .y,␊
    .a,␊
    .g,␊
    .u,␊
    .x,␊
    .x,␊
    .c,␊
    .f,␊
    .e,␊
    .n,␊
    .r,␊
    .t,␊
    .w,␊
    .b,␊
    .h,␊
    .j,␊
    .m,␊
    .k,␊
    .o,␊
    .ö,␊
    .ä {␊
      background-image: url("barn.jpg");␊
      z-index: 999;␊
      color: #fff;␊
      width: 200px;␊
      background-repeat: no-repeat;␊
      background-position: right top;␊
      background-attachment: fixed;␊
      font-weight: 100;␊
      font-style: bold: margin-top: 100px;␊
      display: flex;␊
      position: absolute;␊
      float: right;␊
      margin-left: 100px;␊
      padding-right: 25px;␊
      transition: ease-in;␊
      visibility: padding-bottom: 40px;␊
      font-weight: 100;␊
      font-style: bold: padding-left: 25px;␊
      visibility: collapse;␊
      min-inline-size: inherit;␊
    }`

## Sort Properties (Alphabetical)

> ### Snapshot 1
> Test CSS selector property sorting. Property sorting will be applied in alphabetical order. The first snapshot has sorting enabled, the second snapshot has it disabled.
> ```js
> {
>   "style": {
>     "sortProperties": true
>   }
> }
> ```

    `.selector {␊
      background-attachment: fixed;␊
      background-image: url("barn.jpg");␊
      background-position: right top;␊
      background-repeat: no-repeat;␊
      color: #fff;␊
      display: flex;␊
      float: right;␊
      font-style: bold: margin-top: 100px;␊
      font-style: bold: padding-left: 25px;␊
      font-weight: 100;␊
      font-weight: 100;␊
      margin-left: 100px;␊
      min-inline-size: inherit;␊
      padding-right: 25px;␊
      position: absolute;␊
      transition: ease-in;␊
      visibility: padding-bottom: 40px;␊
      visibility: collapse;␊
      width: 200px;␊
      z-index: 999;␊
    }␊
    ␊
    body {␊
      background-attachment: fixed;␊
      background-image: url("barn.jpg");␊
      background-position: right top;␊
      background-repeat: no-repeat;␊
      color: #fff;␊
      display: flex;␊
      float: right;␊
      font-style: bold: margin-top: 100px;␊
      font-style: bold: padding-left: 25px;␊
      font-weight: 100;␊
      font-weight: 100;␊
      margin-left: 100px;␊
      min-inline-size: inherit;␊
      padding-right: 25px;␊
      position: absolute;␊
      transition: ease-in;␊
      visibility: padding-bottom: 40px;␊
      visibility: collapse;␊
      width: 200px;␊
      z-index: 999;␊
    }␊
    img {␊
      font-size: 12px;␊
      margin: 100px;␊
      padding: 40px 25px;␊
    }`

> ### Snapshot 2
> Test CSS selector property sorting. Property sorting will be applied in alphabetical order. The first snapshot has sorting enabled, the second snapshot has it disabled.
> ```js
> {
>   "style": {
>     "sortProperties": false
>   }
> }
> ```

    `img {␊
      padding: 40px 25px;␊
      margin: 100px;␊
      font-size: 12px;␊
    }␊
    ␊
    body {␊
      background-image: url("barn.jpg");␊
      z-index: 999;␊
      color: #fff;␊
      width: 200px;␊
      background-repeat: no-repeat;␊
      background-position: right top;␊
      background-attachment: fixed;␊
      font-weight: 100;␊
      font-style: bold: margin-top: 100px;␊
      display: flex;␊
      position: absolute;␊
      float: right;␊
      margin-left: 100px;␊
      padding-right: 25px;␊
      transition: ease-in;␊
      visibility: padding-bottom: 40px;␊
      font-weight: 100;␊
      font-style: bold: padding-left: 25px;␊
      visibility: collapse;␊
      min-inline-size: inherit;␊
    }␊
    ␊
    ␊
    .selector {␊
      background-image: url("barn.jpg");␊
      z-index: 999;␊
      color: #fff;␊
      width: 200px;␊
      background-repeat: no-repeat;␊
      background-position: right top;␊
      background-attachment: fixed;␊
      font-weight: 100;␊
      font-style: bold: margin-top: 100px;␊
      display: flex;␊
      position: absolute;␊
      float: right;␊
      margin-left: 100px;␊
      padding-right: 25px;␊
      transition: ease-in;␊
      visibility: padding-bottom: 40px;␊
      font-weight: 100;␊
      font-style: bold: padding-left: 25px;␊
      visibility: collapse;␊
      min-inline-size: inherit;␊
    }`

## Compress CSS

> ### Snapshot 1
> Testing compress css
> ```js
> {
>   "style": {
>     "compressCSS": true
>   }
> }
> ```

    `:is(section, article, aside, nav):is(h1, h2, h3, h4, h5, h6){color:#BADA55}␊
    ␊
    input{width:130px;float:right}␊
    ␊
    section h1,␊
    section h2,␊
    section h3,␊
    section h4,␊
    section h5,␊
    section h6,␊
    article h1,␊
    article h2,␊
    article h3,␊
    article h4,␊
    article h5,␊
    article h6,␊
    aside h1,␊
    aside h2,␊
    aside h3,␊
    aside h4,␊
    aside h5,␊
    aside h6,␊
    nav h1,␊
    nav h2,␊
    nav h3,␊
    nav h4,␊
    nav h5,␊
    nav h6{color:#BADA55}`

> ### Snapshot 2
> Testing compress css
> ```js
> {
>   "style": {
>     "compressCSS": false
>   }
> }
> ```

    `:is(section, article, aside, nav):is(h1, h2, h3, h4, h5, h6){␊
      color: #BADA55;␊
    }␊
    ␊
    input {␊
      width: 130px;␊
      float: right;␊
    }␊
    ␊
    section h1,␊
    section h2,␊
    section h3,␊
    section h4,␊
    section h5,␊
    section h6,␊
    article h1,␊
    article h2,␊
    article h3,␊
    article h4,␊
    article h5,␊
    article h6,␊
    aside h1,␊
    aside h2,␊
    aside h3,␊
    aside h4,␊
    aside h5,␊
    aside h6,␊
    nav h1,␊
    nav h2,␊
    nav h3,␊
    nav h4,␊
    nav h5,␊
    nav h6 {␊
      color: #BADA55;␊
    }`
