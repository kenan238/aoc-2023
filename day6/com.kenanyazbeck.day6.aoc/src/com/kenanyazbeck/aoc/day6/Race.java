package com.kenanyazbeck.aoc.day6;

public class Race {
	public long time; // how much the race lasts
	public long distance;
	
	public Race(long time, long distance) {
		this.time = time;
		this.distance = distance;
	}
	
	public double getPressTime() {
		double v = (this.time * this.time) - 4 * this.distance - 1;
		return v;
	}
	
	public double getImprovements() {
		double p = this.getPressTime();
		double left = Math.ceil((this.time - Math.sqrt(p)) / 2.0);
		double right = Math.floor((this.time + Math.sqrt(p)) / 2.0);
		return right - left + 1;
	}
	
	public static int pressTimeToDistance(int pressTime, int totalTime) {
		return totalTime * pressTime;
	}
}
