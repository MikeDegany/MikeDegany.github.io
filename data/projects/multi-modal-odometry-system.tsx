import { ProjectContent } from "./types"

export const content: ProjectContent = {
  title: "Helping Robots Find Their Way (Even in the Darkest Hallways)",
  body: (
    <>
      <p className="leading-relaxed mb-6 text-lg">
        Imagine walking down an extremely long, perfectly white hallway with no doors or windows. After a few
        minutes, you&apos;d probably lose track of exactly how far you&apos;ve traveled. Is that the same spot
        you were at two minutes ago?
      </p>
      <p className="leading-relaxed mb-6 text-lg">
        Robots face this exact same problem. Most modern robots use LiDAR (essentially a laser-based
        &quot;eye&quot;) to map their surroundings. But when a robot is in a featureless corridor or a wide-open
        field, the laser sees nothing but a blank wall or empty space. This is what we call &quot;geometric
        degeneracy,&quot; and it&apos;s where most navigation systems fail.
      </p>

      <h2 className="text-3xl font-bold mb-6 mt-12">Giving the Robot a Better &quot;Inner Ear&quot;</h2>
      <p className="leading-relaxed mb-6 text-lg">
        To solve this, I developed a system that doesn&apos;t just rely on what the robot sees, but also on how
        it feels and how it&apos;s built.
      </p>
      <p className="leading-relaxed mb-4 text-lg">
        By combining three distinct layers of data, the robot gets a much clearer picture of its motion:
      </p>
      <ul className="list-disc pl-6 space-y-3 mb-12 text-lg leading-relaxed">
        <li>
          <span className="font-semibold">The Eyes (LiDAR):</span> Scans the room to find landmarks.
        </li>
        <li>
          <span className="font-semibold">The Inner Ear (IMU):</span> Measures balance and rotation, just like
          the fluid in your own ears helps you stay upright.
        </li>
        <li>
          <span className="font-semibold">The Feet (Wheel Encoders):</span> Counts exactly how many times the
          wheels turn to estimate distance.
        </li>
      </ul>

      <h2 className="text-3xl font-bold mb-6 mt-12">Teaching Physics to the Software</h2>
      <p className="leading-relaxed mb-6 text-lg">
        The secret sauce isn&apos;t just adding more sensors; it&apos;s enforcing kinematic constraints. In
        plain English, this means telling the software the &quot;rules&quot; of the robot&apos;s body. For
        example, a wheeled robot can&apos;t suddenly jump three feet into the air or slide perfectly sideways.
      </p>
      <p className="leading-relaxed mb-12 text-lg">
        By hard-coding these physical rules "known as kinematic constraints" into the brain of the robot, the system can &quot;ignore&quot;
        sensor data that seems physically impossible, leading to a much smoother and more accurate path.
      </p>

      <h2 className="text-3xl font-bold mb-6 mt-12">Handling the &quot;Banana Peel&quot; Problem</h2>
      <p className="leading-relaxed mb-6 text-lg">
        We also addressed wheel slippage. If a robot drives over a patch of wet grass or loose gravel, its
        wheels might spin while the robot stays still. A standard robot would think it has traveled a long
        distance, causing its map to break.
      </p>
      <p className="leading-relaxed mb-12 text-lg">
        My system constantly compares the wheel speed to the &quot;inner ear&quot; (the IMU). If the wheels are
        spinning but the body isn&apos;t moving, the system instantly detects the slip and relies more heavily
        on its other sensors until the robot finds its footing again.
      </p>

      <h2 className="text-3xl font-bold mb-6 mt-12">The Result: Precision Everywhere</h2>
      <p className="leading-relaxed mb-6 text-lg">
        Whether it&apos;s navigating a cramped indoor hallway or an uneven outdoor field, this multi-sensor
        approach ensures the robot always knows its place. In our tests, this &quot;teamwork&quot; between
        sensors resulted in significantly lower errors than systems that rely on just one or two inputs. It
        turns out that when it comes to robotics, having a good &quot;sense of self&quot; is just as important as
        having good eyes.
      </p>
    </>
  ),
}
