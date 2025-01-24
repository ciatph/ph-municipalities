# Contribution Guidelines

Welcome to the ph-municipalities repository! We're excited to have you contribute to standardizing and organizing Philippine provinces and municipalities' names listing from the [PAGASA 10-day weather forecast Excel](https://www.pagasa.dost.gov.ph/climate/climate-prediction/10-day-climate-forecast) files. To ensure a smooth contribution process for everyone, please follow these guidelines.

## Getting Started

1. **Fork the Repository:** Start by forking the repository's `"dev"` branch to your GitHub account. This creates your own copy of the project where you can make changes.

2. **Clone Your Fork:** Clone your forked repository to your local machine using Git. This allows you to work on the files locally.
   ```
   git clone https://github.com/yourusername/ph-municipalities.git
   ```

3. **Set Upstream Remote:** Add the original repository as an upstream remote to your local clone. This helps you to keep your fork up to date.
   ```
   git remote add upstream https://github.com/ciatph/ph-municipalities.git
   ```

## Making Changes

1. **Create a New Branch:** Always work on a new branch for your changes. This keeps your contributions organized and separate from the main branch.
   ```
   git checkout -b feat/your-new-feature-name
   ```

2. **Add Your Content:** Make your changes or additions to the project. If you're adding new content, ensure it's placed in the correct directory and follows intuitive naming conventions and JavaScript coding best practices and patterns for Node.

3. **Commit Your Changes:** After making your changes, commit them to your branch. Use clear and concise commit messages to describe your updates.
   ```
   git add .
   git commit -m "Add a brief description of your changes"
   ```

4. **Keep Your Fork Updated:** Regularly sync your fork's `"dev"` branch with the upstream repository to keep it up to date. This reduces potential merge conflicts.
   ```
   git fetch upstream
   git checkout dev
   git merge upstream/dev
   git push origin dev
   ```

## Submitting Contributions

1. **Push Your Changes:** Push your changes to your fork on GitHub.
   ```
   git push origin feat/your-new-feature-name
   ```

2. **Create a Pull Request (PR):** Go to the original ph-municipalities repository on GitHub and create a new pull request. Base your PR on your feature branch and target the `"dev"` branch of the upstream repository.

3. **Describe Your Contribution:** Provide a clear and detailed description of your pull request. Include the purpose of your changes and any other relevant information.

4. **Review and Collaboration:** Once your PR is submitted, the project maintainers will review your contributions. Be open to feedback and ready to make additional changes if requested.

## Guidelines

1. **Quality:** Ensure your contributions are high quality, with no spelling or grammatical errors.

2. **Relevance:** Content should be relevant to mostly JavaScript and JSON data engineering, structuring, and code  documentation for users interested in using provinces and municipalities names listed from the PAGASA 10-day weather forecast.

3. **Respect:** Respect the structure and formatting of the existing project. Follow the standard ESLint rules defined in its `app/eslintrc.js` file. Use JavaScript classes or modules where appropriate.

Thank you for contributing to the ph-municipalities repository. Your efforts help make our PAGASA weather forecast parsing community a more organized and structured space for data enthusiasts.

---

### Credits

Contributing Guidelines inspired by the [DataEngineeringPilipinas](https://github.com/ogbinar/DataEngineeringPilipinas) Contributing guide.
