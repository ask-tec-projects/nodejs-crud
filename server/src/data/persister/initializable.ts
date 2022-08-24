export interface InitializablePersister {
    init(): Promise<void>;
}
