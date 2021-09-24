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

  it("should be created", (done) => {
    const service: IDBStorageService = TestBed.inject(IDBStorageService);
    expect(service).toBeTruthy();

    setTimeout(() => {
      expect(service.initialized).toBeTrue();
      done();
    }, 100);
  });
});
