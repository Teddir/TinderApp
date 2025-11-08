<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Popular Person Alert</title>
</head>
<body style="font-family: Arial, sans-serif; color: #1f2933;">
<h2>Popular Person Alert 🎉</h2>
<p>{{ $person->name }} from {{ $person->location }} just crossed <strong>{{ $likesCount }} likes</strong>.</p>
<p>Here are their featured photos:</p>
<ul>
    @foreach($person->pictures as $picture)
        <li><a href="{{ $picture }}">{{ $picture }}</a></li>
    @endforeach
</ul>
<p>Log in to the admin dashboard to review and take further action.</p>
<p style="margin-top: 24px;">— TinderClone Alerts</p>
</body>
</html>

