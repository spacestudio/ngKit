import { StorageService } from './storage.service';
import { NgKitModule } from '../../ngkit.module';
import { TestBed } from '@angular/core/testing';

describe("StorageService", () => {
  let service: StorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NgKitModule],
    });
    service = TestBed.inject(StorageService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
