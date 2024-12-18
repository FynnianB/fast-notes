import type { ErrorInfo, ReactNode } from 'react';
import { Component } from 'react';
import logger from '@common/services/logger.service';
import { Box, Text } from '@radix-ui/themes';

interface ErrorBoundaryProps {
    children: ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(): ErrorBoundaryState {
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        logger.error(`ErrorBoundary | ${error.message}`, {
            message: error.message,
            stack: error.stack,
            componentStack: errorInfo.componentStack,
        });
    }

    render() {
        const { children } = this.props;
        const { hasError } = this.state;
        if (hasError) {
            return <Box><Text color="red" size="5" weight="bold">Something went wrong.</Text></Box>;
        }

        return children;
    }
}

export default ErrorBoundary;
