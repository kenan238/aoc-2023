package com.kenanyazbeck.aoc.day6;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;

public class Day6 {
	private static ArrayList<Integer> times = new ArrayList<Integer>();
	private static ArrayList<Integer> distances = new ArrayList<Integer>();
	private static ArrayList<Race> races = new ArrayList<Race>();
	
	public static void main(String[] args) throws IOException {
		BufferedReader br = null;
		
		System.out.println(System.getProperty("user.dir"));
		
		try {
			File file = new File("data.txt");
			FileReader fr = new FileReader(file);
			br = new BufferedReader(fr);
			String line;
			
			while ((line = br.readLine()) != null) {
				// processing
				String[] splitted = line.split("\\s+");
				switch (splitted[0]) {
				case "Time:":
					for (int i = 1; i < splitted.length; i++) {
						int number = Integer.parseInt(splitted[i]);
						times.add(number);
					}
					break;
				case "Distance:":
					for (int i = 1; i < splitted.length; i++) {
						int number = Integer.parseInt(splitted[i]);
						distances.add(number);
					}
					break;
				}
			}
			
			for (int i = 0; i < times.size(); i++) {
				int time = times.get(i);
				int dist = distances.get(i);
				races.add(new Race(time, dist));
			}
			
			// Part 1
			int improvements = 1;
			for (int i = 0; i < races.size(); i++) {
				Race race = races.get(i);
				improvements *= race.getImprovements();
			}
			
			System.out.println("Part 1: " + Integer.toString(improvements));
			
			// Part 2
			StringBuilder timesBuilder = new StringBuilder();
			StringBuilder distBuilder = new StringBuilder();
			
			for (int i = 0; i < times.size(); i++) {
				int time = times.get(i);
				int dist = distances.get(i);
				timesBuilder.append(Integer.toString(time));
				distBuilder.append(Integer.toString(dist));
			}
			
			long totalTime = Long.parseLong(timesBuilder.toString());
			long totalDist = Long.parseLong(distBuilder.toString());
			
			Race singular = new Race(totalTime, totalDist);
			System.out.println("Part 2: " + Long.toString((long)singular.getImprovements()));
		}
		catch (FileNotFoundException e) {
			e.printStackTrace();
		}
		finally {
			try {
				if (br != null)
					br.close();
			}
			catch (IOException e) {
				e.printStackTrace();
			}
		}
	}

}
