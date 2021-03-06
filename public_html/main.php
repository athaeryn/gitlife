<!DOCTYPE html>
<html class="no-js">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <title>GitLife</title>
        <meta name="description" content="">
        <meta name="viewport" content="width=device-width">

        <link rel="shortcut icon" type="image/x-icon" href="/favicon.ico?v=3">
        <link rel="stylesheet" href="css/main.css">

        <script src="js/vendor/modernizr-2.6.2.min.js"></script>
    </head>
    <body>
        <!--[if lt IE 7]>
            <p class="chromeframe">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> or <a href="http://www.google.com/chromeframe/?redirect=true">activate Google Chrome Frame</a> to improve your experience.</p>
        <![endif]-->
        <header class="page-outer">
            <div class="page-inner">
                <a href="/">
                    <div class="logo"></div>
                </a>
                <nav>
                    <a href="javascript:void(0);" id="about-toggle">about</a>
                </nav>
            </div>
        </header>
        <div class="page-inner">
            <div class="left-column">
                <img src="" id="gravatar" height="210" width="210">
                <h1 class="name" id="name"></h1>
                <h3 class="username" id="username"></h3>
                <h3 class="error" id="error"></h3>
                <hr>
            </div>
            <div class="right-column">
                <div class="about-content" id="about-content" style="display: none">
                    <h1>GitLife</h1>
                    <p>
                        GitLife takes the nifty <a href="https://github.com/blog/1360-introducing-contributions">contributions calendar</a> from a GitHub user's profile and turns it into a simulation of <a href="http://en.wikipedia.org/wiki/Conway's_Game_of_Life">Conway's Game of Life</a>.
                        The code is up on Github <a href="https://github.com/athaeryn/gitlife">over here</a>, and you can direct feeback to <a href="mailto:hello@mrmikea.com">hello@mrmikea.com</a>.
                    </p>
                    <h2>Instructions</h2>
                    <ul>
                        <li>Enter a GitHub username into the search bar.</li>
                        <li>Click the grid to play the simulation.</li>
                    </ul>
                    <p>You can also send links to people like this: <a href="http://gitlife.mrmikea.com/athaeryn">gitlife.mrmikea.com/athaeryn</a></p>
                </div>
                <div class="grid-container">
                    <div class="top clearfix">
                        <div class="search-bar">
                            <form>
                                <input id="search" type="text" placeholder="Search for a user..." autocomplete="off">
                                <button type="submit" class="go" id="submit"></button>
                            </form>
                        </div>
                        <span id="stepsBox">--</span>
                    </div>
                    <canvas id="grid" width="634" height="250">
                        This website uses HTML5's canvas to function. If you're reading 
                        this, your browser doesn't support canvas, which means you're 
                        probably running an old version of IE. Consider updating that old 
                        thing so you can join in the fun!
                    </canvas>
                </div>
            </div>
        </div>
        <script src="js/vendor/jquery-1.9.1.min.js"></script>
        <script src="js/vendor/typeahead.min.js"></script>
        <script src="js/validateArgs.js"></script>
        <script src="js/GameOfLife.js"></script>
        <script src="js/main.js"></script>
        <script>
            var _gaq=[['_setAccount','UA-38200450-3'],['_trackPageview']];
            (function(d,t){var g=d.createElement(t),s=d.getElementsByTagName(t)[0];
            g.src=('https:'==location.protocol?'//ssl':'//www')+'.google-analytics.com/ga.js';
            s.parentNode.insertBefore(g,s)}(document,'script'));
        </script>
            <?php /* ?>
        <script type="text/javascript">
            var _gauges = _gauges || [];
            (function() {
                var t   = document.createElement('script');
                t.type  = 'text/javascript';
                t.async = true;
                t.id    = 'gauges-tracker';
                t.setAttribute('data-site-id', '514a89a9613f5d208f000155');
                t.src = '//secure.gaug.es/track.js';
                var s = document.getElementsByTagName('script')[0];
                s.parentNode.insertBefore(t, s);
            })();
        </script>
    <?php */ ?>
    </body>
</html>
