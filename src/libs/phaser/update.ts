function update (time, delta) {
	// process destruction queue

	if (len(dq.queue) != 0) {
		dq.queue.forEach(function(car: Car) {
			remove_car_from_world(sm, car);
			remove_car_from_scene(car);

			const time: number = (Date.now() - car.creation_timestamp) / 1000;

			car.fitness = fitness(car.total_distance, car.total_distance / time);
		});
		dq.queue = [];
	}

	// box2d step

	sm.world.Step(1 / 30, 10, 10);
	// sm.world.DrawDebugData();
	sm.world.ClearForces();

	// cars step

	let lg: Generation = last_generation(sm);

	lg.cars.forEach(function(car: Car) {
		if (car.total_distance > furthest_car.total_distance)
			furthest_car = car;

		if (!car.destroyed)
			step_car(sm, car, delta);
	});

	// camera

	this.cameras.main.setScroll(furthest_car.car_body.GetPosition().x * SCALE - 300, furthest_car.car_body.GetPosition().y * SCALE - 300);

	// text
	distance_text.setText("Distance: " + Math.round(furthest_car.total_distance * 100) / 100);
	distance_text.x = this.cameras.main.ScrollX;
	distance_text.y = this.cameras.main.ScrollY;
}