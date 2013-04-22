<!DOCTYPE html>
<html class="no-js">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <title>Gitlife</title>
        <meta name="description" content="">
        <meta name="viewport" content="width=device-width">

        <link rel="shortcut icon" type="image/x-icon" href="/favicon.ico?v=2">
        <link rel="stylesheet" href="css/main.css">

        <script src="js/vendor/modernizr-2.6.2.min.js"></script>
    </head>
    <body>
        <!--[if lt IE 7]>
            <p class="chromeframe">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> or <a href="http://www.google.com/chromeframe/?redirect=true">activate Google Chrome Frame</a> to improve your experience.</p>
        <![endif]-->
        <header class="page-outer">
            <div class="page-inner">
                <div class="logo"></div>
                <nav>
                    <ul>
                        <li><a href="/">about</a></li>
                        <li><a href="/">contribute</a></li>
                    </ul>
                </nav>
            </div>
        </header>
        <div class="page-inner">
            <div class="left-column">
                <img src="http://gravatar.com/avatar/a4db33172b6f59a50b7e9621538026ed?s=210" id="gravatar" height="210" width="210">
                <h1 class="name">Mike Anderson</h1>
                <h3 class="username">athaeryn</h3>
                <hr>
            </div>
            <div class="right-column">
                <div class="grid-container">
                    <div class="top clearfix">
                        <input type="text" placeholder="Search for a user..." autofocus="autofocus">
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
