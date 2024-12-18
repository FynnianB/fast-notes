import OverlayInput from '@modules/overlay/components/overlay-input/overlay-input.component';
import OverlayShortcuts from '@modules/overlay/components/overlay-shortcuts/overlay-shortcuts.component';
import ErrorBoundary from '@common/components/error-boundary/error-boundary.component';
import style from './overlay.module.less';

const OverlayView = () => (
    <div className={style.component}>
        <main className={style.content}>
            <ErrorBoundary>
                <OverlayInput />
                <OverlayShortcuts />
            </ErrorBoundary>
        </main>
    </div>
);

export default OverlayView;
