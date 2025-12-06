using CarAccessControl.Application.Common.Specifications;
using CarAccessControl.Domain.Entities;

namespace CarAccessControl.Application.Features.Gates.Specifications;

public class GateByCameraIdSpec(int cameraId) : BaseSpecification<Gate>(g => g.CameraId == cameraId);