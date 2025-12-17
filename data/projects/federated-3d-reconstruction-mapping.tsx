import { ProjectContent } from "./types"

export const content: ProjectContent = {
  title: "Federated approach for 3D reconstruction and Mapping for Connected Autonomous Vehicles",
  body: (
    <>
      <h2 className="text-3xl font-bold mb-6 mt-12">Project Overview</h2>
      <p className="leading-relaxed mb-6 text-lg">
        3D Gaussian Splatting meets SLAM. This project explores federated learning approaches for
        3D reconstruction and mapping in connected autonomous vehicle systems.
      </p>
      <p className="leading-relaxed mb-12 text-lg">
        By combining state-of-the-art 3D reconstruction techniques with federated learning, this
        system enables multiple vehicles to collaboratively build and share 3D maps while preserving
        privacy and reducing communication overhead.
      </p>

      <h2 className="text-3xl font-bold mb-6 mt-12">Key Innovations</h2>
      <ul className="list-disc pl-6 space-y-3 mb-12 text-lg leading-relaxed">
        <li>Federated learning for distributed mapping</li>
        <li>3D Gaussian Splatting integration</li>
        <li>Privacy-preserving map sharing</li>
        <li>Efficient communication protocols</li>
      </ul>
    </>
  ),
  images: ["/3dgsStreet.png"],
}

