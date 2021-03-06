# Snapshot report for `tests/cases/comments.test.mjs`

The actual snapshot is saved in `comments.test.mjs.snap`.

Generated by [AVA](https://avajs.dev).

## Markup ignore file Liquid comment

> Snapshot 1

    `{% comment %} @prettify-ignore {% endcomment %}␊
    ␊
    <div>File should not be formatted</div>␊
    `

## Markup ignore file HTML comment

> Snapshot 1

    `<!-- @prettify-ignore -->␊
    ␊
    <h1>Ignore formatting on this file</h1>␊
    ␊
    <p>No indentation or formatting will be applied to this sample.</p>␊
    ␊
    <div id="x">␊
    <ul>␊
    ␊
    <li>foo</li>      <li>␊
                bar␊
    ␊
    ␊
                </li>␊
    <li>bax                                                        </li>␊
    ␊
    </ul>␊
    </div>␊
    ␊
    <div> <div>␊
    ␊
        <div>␊
    ␊
                <div>␊
    ␊
                <main> <div> 1 2 3 </div> </main>␊
    ␊
                </div>␊
    ␊
        </div>␊
    ␊
    </div> </div>␊
    ␊
    `

## Markup ignored regions Liquid comments

> Snapshot 1

    `<ul>␊
      <li>␊
    ␊
        {{ foo | replace: article.id, 'dd' }}␊
    ␊
      </li>␊
    ␊
    ␊
      {% comment %}@prettify-ignore-start{%- endcomment -%}␊
    <li>␊
    <div> WILL NOT FORMAT </div>␊
    </li>␊
    {% comment -%}@prettify-ignore-end{%- endcomment -%}␊
    ␊
      <li>␊
        {{ baz }}␊
      </li>␊
    ␊
      <li>␊
        {{ 'sss' }}␊
      </li>␊
      <li {{ bae }}>␊
        {{ bae }}␊
      </li>␊
      <li>␊
        {{ s }}␊
      </li>␊
    </ul>␊
    ␊
    {% comment %}@prettify-ignore-start{% endcomment %}␊
    {%if customer.name == "xxx" %} THIS WILL BE IGNORED AND NOT FORMATTED␊
    {% elsif customer.name == "xx" %}␊
    The lines and spacing will be preserver {% else %}Hi Stranger!         {% endif %}␊
    {% comment %}@prettify-ignore-end{% endcomment %}␊
    ␊
    Formatting is applied:␊
    ␊
    <div>␊
      <ul>␊
        <li>␊
          one␊
        </li>␊
        <li>␊
          two␊
        </li>␊
      </ul>␊
    </div>␊
    ␊
    ␊
    Lets test Liquid comment ignores␊
    ␊
    {% comment %}@prettify-ignore-start{% endcomment -%}␊
    ␊
    {%- comment -%}␊
    example␊
    {%- endcomment -%}␊
    ␊
    <div>␊
    <ul>␊
    <li>one</li>␊
    <li>two</li>␊
    </ul>␊
    </div>␊
    {%- comment %}@prettify-ignore-end {%- endcomment %}␊
    ␊
    ␊
    <div class="bar">␊
      <div>␊
        foo␊
      </div>␊
    </div>␊
    ␊
    ␊
    <div>␊
      <ul>␊
        <li>␊
          one␊
        </li>␊
        <li>␊
          two␊
        </li>␊
      </ul>␊
    </div>`

## Markup ignored regions HTML comments

> Snapshot 1

    `<ul>␊
        <li>␊
    ␊
            {{ foo | replace: article.id, 'dd' }}␊
    ␊
        </li>␊
    ␊
    ␊
        <!-- @prettify-ignore-start -->␊
        <li>␊
            <div>␊
                WILL NOT FORMAT␊
            </div>␊
        </li>␊
        <!-- @prettify-ignore-end -->␊
    ␊
        <li>␊
            {{ baz }}␊
        </li>␊
    ␊
        <li>␊
            {{ 'sss' }}␊
        </li>␊
        <li {{ bae }}>␊
            {{ bae }}␊
        </li>␊
        <li>␊
            {{ s }}␊
        </li>␊
    </ul>␊
    ␊
    <!-- @prettify-ignore-start -->␊
    {% if customer.name == "xxx" %}␊
        THIS WILL BE IGNORED AND NOT FORMATTED␊
    {% elsif customer.name == "xx" %}␊
        The lines and spacing will be preserver␊
    {% else %}␊
        Hi Stranger!␊
    {% endif %}␊
    <!-- @prettify-ignore-end -->␊
    ␊
    Formatting is applied:␊
    ␊
    <div>␊
        <ul>␊
            <li>␊
                one␊
            </li>␊
            <li>␊
                two␊
            </li>␊
        </ul>␊
    </div>␊
    ␊
    ␊
    Lets test Liquid comment ignores␊
    ␊
    <!-- @prettify-ignore-start -->␊
    ␊
    {%- comment -%}␊
        example␊
    {%- endcomment -%}␊
    ␊
    <div>␊
        <ul>␊
            <li>␊
                one␊
            </li>␊
            <li>␊
                two␊
            </li>␊
        </ul>␊
    </div>␊
    ␊
    ␊
    <!-- @prettify-ignore-end -->␊
    ␊
    ␊
    <div class="bar">␊
        <div>␊
            foo␊
        </div>␊
    </div>␊
    ␊
    ␊
    <div>␊
        <ul>␊
            <li>␊
                one␊
            </li>␊
            <li>␊
                two␊
            </li>␊
        </ul>␊
    </div>`

## Script ignore file line comment

> Snapshot 1

    `// @prettify-ignore␊
    ␊
    function(x){const foo = 'x'}␊
    ␊
    const arr [␊
    'x'␊
         ,␊
    ␊
    'xx'␊
    ␊
    ]␊
    `

## Script ignore file block comment

> Snapshot 1

    `// @prettify-ignore␊
    ␊
    function(x){const foo = 'x'}␊
    ␊
    const arr [␊
    'x'␊
         ,␊
    ␊
    'xx'␊
    ␊
    ]␊
    `

## Script ignored regions block comments

> Snapshot 1

    `␊
    /* @prettify-ignore-start */␊
    ␊
    function () {␊
    ␊
    const x = [␊
    1 ,␊
          2␊
    ,  3␊
    ␊
    , 5, {␊
    ␊
              fooo: 'x'␊
    }␊
    ]␊
    ␊
    return x␊
    ␊
    ␊
    }␊
    ␊
    /* @prettify-ignore-end */␊
    ␊
    ␊
    function () {␊
    ␊
    const x = [␊
    1 ,␊
          2␊
    ,  3␊
    ␊
    , 5, {␊
    ␊
              fooo: 'x'␊
    }␊
    ]␊
    ␊
    return x␊
    ␊
    ␊
    }␊
    `

## Script ignored regions inline comments

> Snapshot 1

    `␊
    /* @prettify-ignore-start */␊
    ␊
    function () {␊
    ␊
    const x = [␊
    1 ,␊
          2␊
    ,  3␊
    ␊
    , 5, {␊
    ␊
              fooo: 'x'␊
    }␊
    ]␊
    ␊
    return x␊
    ␊
    ␊
    }␊
    ␊
    /* @prettify-ignore-end */␊
    ␊
    ␊
    function () {␊
    ␊
    const x = [␊
    1 ,␊
          2␊
    ,  3␊
    ␊
    , 5, {␊
    ␊
              fooo: 'x'␊
    }␊
    ]␊
    ␊
    return x␊
    ␊
    ␊
    }␊
    `
