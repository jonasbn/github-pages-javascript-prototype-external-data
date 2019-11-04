# GitHub Pages JavaScript Prototype

_- Experimenting with GitHub Pages and JavaScript and external data_

## Introduction

This prototype picks up from [another prototype][github-pages-javascript-prototype], aimed at answering the question:

> Can you host semi-interactive pages with data using [GitHub Pages][github_pages]?

The work and process sparked the need for new prototype, a prototype which could answer the question:

> Can you host semi-interactive pages with **external** data using [GitHub Pages][github_pages]?

The first prototype demonstranted the use of data for from a local file (a file in the repository), the aim of the second would be to use data retrieved from a URL.

I expect the framework to be somewhat the same, so the success criteria of the prototype are the following:

1. Ability to interact and use data from an external resource
1. The implementation is served from GitHub
1. The implementation is in Vanilla JavaScript

I do howewer expect to evaluate this in regard to content security policy (CSP), without knowing if this will actually be one of the obstacles for my solution, after all the pages is served by GitHub and tweaking the webserver configuration is somewhat beyond our control.

Now lets dig into the details.

## Process

1. I decided to use the [Req  Res service][reqres], which is an open and freely available service serving dummy data as a RESTful service.

    I located an API, which would serve data in a format that would match my needs.

    `https://reqres.in/api/users/2`

    This API serves data for a single user.

    ```JSON
    {
    "data": {
        "id": 2,
        "email": "janet.weaver@reqres.in",
        "first_name": "Janet",
        "last_name": "Weaver",
        "avatar": "https://s3.amazonaws.com/uifaces/faces/twitter/josephstein/128.jpg"
    }
    }
    ```

    2. Instead of using the _pen_ from [Codepen.io] I had used previously I located a new _pen_ which would render what looked like profile/contact data. I decided for: "[User profile][user_profile]" by [Jose Pino][jofpin].

    I copied in the HTML and CSS into the skeleton provided by my previous prototype.

    5. Enabled [GitHub Pages][github_pages] and got the URL:

    `https://jonasbn.github.io/github-pages-javascript-prototype-external-data/`

    The fields between the UI and the JSON does not match up exactly, but for this prototype, this does not really matter, I started to wrap my head around [_Manipulating documents_][mdn_manipulation], did some tweaks, introduced use of [`Document.getElementById()`][mdn_getelementbyid] and IDs in the HTML and something crazy happened - It worked first shot!

    **HTML**:

    ```HTML
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="utf-8" />
        <meta http-equiv="x-ua-compatible" content="ie=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <title></title>

        <link rel="stylesheet" href="style.css" />
        <link rel="icon" href="images/favicon.png" />
    </head>

    <body>
        <h1 class="title-pen"> User Profile <span>UI</span></h1>
        <div class="user-profile">
            <img id="avatar" class="avatar" src="https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcTF_erFD1SeUnxEpvFjzBCCDxLvf-wlh9ZuPMqi02qGnyyBtPWdE-3KoH3s" alt="Ash" />
            <div id="username" class="username">Will Smith</div>
        <div id="bio" class="bio">
            Senior UI Designer
        </div>
            <div class="description">
            I use to design websites and applications
            for the web.
        </div>
        <ul class="data">
            <li>
            <span class="entypo-heart"> 127</span>
            </li>
            <li>
            <span class="entypo-eye"> 853</span>
            </li>
            <li>
            <span class="entypo-user"> 311</span>
            </li>
        </ul>
        </div>
        <footer>
            <h1>inspired by
        <a href="https://dribbble.com/shots/1033074-User-Profile">
        <span class="entypo-dribbble"></span> shot</a>
            </h1>
        </footer>
        <script src="experiment.js"></script>
    </body>
    </html>
    ```

    **JavaScript**:

    ```javascript
    function reqListener () {
        var obj = JSON.parse(this.responseText);

        const username = document.getElementById('username')
        username.textContent = obj.data.first_name + " " + obj.data.last_name;

        const bio = document.getElementById('bio')
        bio.textContent = obj.data.email;

        const avatar = document.getElementById('avatar');
        avatar.src = obj.data.avatar;
    }

    var oReq = new XMLHttpRequest();
    oReq.addEventListener("load", reqListener);
    oReq.open("GET", "https://reqres.in/api/users/2");
    oReq.send();
    ```

    6. I would love for the HTML solution to use IDs instead of classes using [`Document.getElementById()`][mdn_getelementbyid], but getting this to work with minimal changes to the CSS and HTML is somewhat a part of the constraint on the solution space, so I went with: [`Document.querySelector()`][mdn_query_selector].

    Well I decided to go with the solution requiring a minimum of changes to the original _pen_ mostly just for the satisfaction of being able to take something else and get it to work out of the box.

    **JavaScript**:

    ```javascript
    function reqListener () {
        var obj = JSON.parse(this.responseText);

        const username = document.querySelector('div.username')
        username.textContent = obj.data.first_name + " " + obj.data.last_name;

        const bio = document.querySelector('div.bio')
        bio.textContent = obj.data.email;

        const avatar = document.querySelector('img.avatar');
        avatar.src = obj.data.avatar;
    }

    var oReq = new XMLHttpRequest();
    oReq.addEventListener("load", reqListener);
    oReq.open("GET", "https://reqres.in/api/users/2");
    oReq.send();
    ```

    The satisfaction of taking something and _hacking_ it to work is also incredible, but for this it pushed my knowledge on [the use of selectors][mdn_locating_dom].

    7. Since it worked I decided to add a little demonstration of the load of the data, so the page would first render with the static data, which would then be exchanged by the data provided by the API.

    ```javascript
    function reqListener () {
        var obj = JSON.parse(this.responseText);

        setTimeout(function(){

            const username = document.querySelector('div.username')
            username.textContent = obj.data.first_name + " " + obj.data.last_name;

            const bio = document.querySelector('div.bio')
            bio.textContent = obj.data.email;

            const avatar = document.querySelector('img.avatar');
            avatar.src = obj.data.avatar;
        }, 2000);
    }

    var oReq = new XMLHttpRequest();
    oReq.addEventListener("load", reqListener);
    oReq.open("GET", "https://reqres.in/api/users/2");
    oReq.send();
    ```

    As stated above, it was quite a surprise to me that it was so easy. I had expected some sort of obstacle or roadblock in the sense of serving the page using external data.

    8. Next I decided to inflict some proper CSP. Please note that next steps are not security advice, it is simply a hack to trying out applying CSP to the prototype.

    First I read the marvellous primer on CSP: [Mozila Hacks: "Implementing Content Security Policy"][moz_hack_csp] together with [Content Security Policy (CSP) Quick Reference][csp_quick_reference] I was able by trial and error to piece together a security policy, applying the to the meta-data section of the `index.html`.

    I started with:

    ```html
    <!-- Enable CSP inside the page's HTML -->
    <head>
        <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src 'self';
            script-src 'self' https://code.jquery.com; style-src 'self'">
    </head>
    ```

    And success - nothing worked! YAY!

    So step by step consulting the [Content Security Policy (CSP) Quick Reference][csp_quick_reference] and the browser developer tools I could piece something together, where my solution would work again, but with CSP enabled.

    ```html
        <meta http-equiv="Content-Security-Policy" content="
            default-src 'self'
            https://fonts.gstatic.com
            https://reqres.in
            http://weloveiconfonts.com;
            img-src 'self'
            https://encrypted-tbn3.gstatic.com
            https://s3.amazonaws.com;
            style-src 'self'
            https://fonts.googleapis.com
            http://weloveiconfonts.com">
    ```

    The above approach works, but cannot be classified as sane advice and I must emphasize the importance of a more sane strategy for use of external resources.

    - `https://fonts.gstatic.com`
    - `https://reqres.in`
    - `http://weloveiconfonts.com`

    Might be _okay__ uses, I would like for these to be only required for the `style-src` part, but:

    - `https://s3.amazonaws.com`

    Open up for pretty much _everything_, so this is included here for the purpose of the demonstration.

    Any suggestions for building content assembly strategies are most welcome  and this lead us to the conclusion of the prototype work.

### Conclusion

The final solution is available [here](https://github.com/jonasbn/github-pages-javascript-prototype-external-data) and you can see it running [here](https://jonasbn.github.io/github-pages-javascript-prototype-external-data/)

All goals:

1. Ability to interact and use data from an external resource
1. The implementation is served from GitHub
1. The implementation is in Vanilla JavaScript

Were met.

The CSP work was quite educational and quite an eye-opener and I would love to (and I most certainly have to) work more in this sphere, but preferably driven by need, since approaching this from a more academic approach is not my _style_, but I guess you have gathered this from following the completed prototype work.

## Next Step

A lot of next steps where outlined in [the description][github-pages-javascript-prototype] and [blog post][first_blog_post] for the first prototype.

I am not going to expand the list any further, I could spend more time getting my head around CSP, but I would much rather let this driven by need.

## References

Thanks to all the people, who unknowningly have contributed to this work.

- [Jose Pino][jofpin]
- The people contributing to StackOverflow and Mozilla Developer Network and the resources used to build the foundation for the first prototype leading to this one

Most of the resources mentioned above are listed here:

- [Req  Res service][reqres]
- [Codepen.io: "User Profile"][user_profile]
- [StackOverflow: "JavaScript sleep/wait before continuing"][stackoverflow]
- [MDN: "Manipulating documents"][mdn_manipulation]
- [MDN: "Locating DOM elements using selectors"][mdn_locating_dom]
- [MDN: `Document.querySelector()`][mdn_query_selector]
- [MDN: `Document.getElementById()`][mdn_getelementbyid]
- [Mozila Hacks: "Implementing Content Security Policy"][moz_hack_csp]
- [Content Security Policy (CSP) Quick Reference][csp_quick_reference]

[moz_hack_csp]: https://hacks.mozilla.org/2016/02/implementing-content-security-policy/
[csp_quick_reference]: https://content-security-policy.com/
[mdn_manipulation]: https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Client-side_web_APIs/Manipulating_documents
[mdn_locating_dom]: https://developer.mozilla.org/en-US/docs/Web/API/Document_object_model/Locating_DOM_elements_using_selectors
[mdn_query_selector]: https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector
[mdn_getelementbyid]: https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementById
[user_profile]: https://codepen.io/jofpin/pen/svtHc
[jofpin]: https://twitter.com/jofpin
[Codepen.io]: https://codepen.io/
[github_pages]: https://pages.github.com/
[github-pages-javascript-prototype]: https://github.com/jonasbn/github-pages-javascript-prototype
[reqres]: https://reqres.in/
[first_blog_post]: https://dev.to/jonasbn/blog-post-experimenting-with-github-pages-and-javascript-571c
[stackoverflow]: https://stackoverflow.com/questions/16873323/javascript-sleep-wait-before-continuing
