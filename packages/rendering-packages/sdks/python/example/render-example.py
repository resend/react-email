import urllib
from ...python import render

template_path = urllib.parse.urljoin(__file__, "./email.tsx");
print(
    render(
        template_path, 
        {
            "username": "Gabriel Miranda"
        }
    )
)
