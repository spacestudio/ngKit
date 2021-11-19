import { NgKitModule } from '../../ngkit.module';
import { IDBStorageService } from '.';
import { TestBed } from '@angular/core/testing';

describe("IDBStorageService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NgKitModule],
    });
  });

  afterEach(() => {
    const service: IDBStorageService = TestBed.inject(IDBStorageService);
    service.clear();
  });

  it("should be created", () => {
    const service: IDBStorageService = TestBed.inject(IDBStorageService);
    expect(service).toBeTruthy();

    return new Promise<void>((resolve) => {
      setTimeout(async () => {
        expect(service.initialized).toBeTrue();
        resolve();
      });
    });
  });
});
