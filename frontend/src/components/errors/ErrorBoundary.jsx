import React from 'react';
import Error500 from './Error500';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Обновляем состояние с тем, чтобы следующий рендер показал запасной UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Можно также сохранить информацию об ошибке в службу логирования
    console.error("ErrorBoundary спіймав помилку:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Вы можете отрендерить любой запасной UI
      return <Error500 />;
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
