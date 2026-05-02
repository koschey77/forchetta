import React from 'react';
import Error500 from './Error500';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Оновлюємо стан для того, щоб наступний рендер показав запасний UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Можна також зберегти інформацію про помилку у службу логування
    console.error("ErrorBoundary спіймав помилку:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Ви можете відрендерити будь-який запасний UI
      return <Error500 />;
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
