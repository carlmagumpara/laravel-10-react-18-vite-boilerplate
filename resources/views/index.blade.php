<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ config('app.name') }}</title>
</head>
<body>
    <div id="root"></div>
    @viteReactRefresh
    @vite('resources/js/main.jsx')
</body>
</html>