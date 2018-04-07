import {ICameraStrategy, Actor, BaseCamera, Engine, Vector} from "excalibur";

export default class SuperCamera implements ICameraStrategy<Actor> {
    /**
     * If cameraElasticity < cameraFriction < 1.0, the behavior will be a dampened spring that will slowly end at the target without bouncing
     * If cameraFriction < cameraElasticity < 1.0, the behavior will be an oscillationg spring that will over
     * correct and bounce around the target
     *
     * @param target Target actor to elastically follow
     * @param cameraElasticity [0 - 1.0] The higher the elasticity the more force that will drive the camera towards the target
     * @param cameraFriction [0 - 1.0] The higher the friction the more that the camera will resist motion towards the target
     */
    constructor(public target: Actor, public cameraElasticity: number, public cameraFriction: number) {
    }

    public action = (target: Actor, cam: BaseCamera, engine: Engine, delta: number) => {
        let position = target.getCenter();
        let focus = cam.getFocus();
        let cameraVel = new Vector(cam.dx, cam.dy);

        // Calculate the strech vector, using the spring equation
        // F = kX
        // https://en.wikipedia.org/wiki/Hooke's_law
        // Apply to the current camera velocity
        const stretch = position.sub(focus).scale(this.cameraElasticity); // stretch is X
        cameraVel = cameraVel.add(stretch);

        // Calculate the friction (-1 to apply a force in the opposition of motion)
        // Apply to the current camera velocity
        const friction = cameraVel.scale(-1).scale(this.cameraFriction);
        cameraVel = cameraVel.add(friction);

        // Update position by velocity deltas
        focus = focus.add(cameraVel);

        return focus;
    }
}