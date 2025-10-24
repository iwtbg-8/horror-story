# My Static Site

This is a simple static website project that showcases a homepage, a custom 404 error page, and additional documentation.

## Project Structure

```
my-static-site
├── index.html          # Main HTML document for the homepage
├── 404.html            # Custom error page for non-existent routes
├── css
│   └── styles.css      # Styles for the website
├── js
│   └── main.js         # JavaScript for interactivity
├── assets
│   └── fonts           # Directory for font files
├── .github
│   └── workflows
│       └── deploy.yml  # GitHub Actions workflow for deployment
├── docs
│   └── index.html      # Additional documentation page
├── .gitignore          # Files and directories to ignore in Git
└── README.md           # Project documentation
```

## Setup Instructions

1. Clone the repository to your local machine:
   ```
   git clone https://github.com/yourusername/my-static-site.git
   ```

2. Navigate to the project directory:
   ```
   cd my-static-site
   ```

3. Open `index.html` in your web browser to view the homepage.

## Usage

- The `index.html` file serves as the main entry point for the website.
- The `404.html` file will be displayed for any non-existent routes.
- Customize the styles in `css/styles.css` and add interactivity using `js/main.js`.

## Deployment

This project includes a GitHub Actions workflow located in `.github/workflows/deploy.yml` that automates the deployment process to GitHub Pages. Ensure you have configured the workflow correctly to deploy your site.

## License

This project is open-source and available under the [MIT License](LICENSE).