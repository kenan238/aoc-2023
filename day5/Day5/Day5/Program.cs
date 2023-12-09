using System;
using System.Collections;

namespace Day5
{
  public class Program
  {
    private static (ulong[], SeedRange[]) ParseSeeds(StreamReader reader, string? line)
    {
      line = line.Replace("seeds: ", "");
      string[] splitted = line.Split(' ');
      ulong[] numbers = splitted.Select(x => Convert.ToUInt64(x)).ToArray();
      List<SeedRange> seeds = new();
      for (int i = 0; i < numbers.Length; i += 2)
      {
        ulong current = numbers[i];
        ulong future = numbers[i + 1];
        seeds.Add(new SeedRange
        {
          Start = current,
          Length = future
        });
      }
      return (numbers, seeds.ToArray());
    }

    private static (string[], string) ParseMap(StreamReader reader, string? line)
    {
      string[] title = line.Split(' ');
      List<string> matrix = new();
      string name = title[0];

      while ((line = reader.ReadLine()) != null)
      {
        if (line == "" || line == "\n")
          break;
        matrix.Add(line);
      }

      return (matrix.ToArray(), name);
    }

    private static ulong[] seeds;
    private static SeedRange[] seedsAsRanges;
    private static Dictionary<string, Range.Type> titleToType = new Dictionary<string, Range.Type>
    {
      {"seed-to-soil", Range.Type.SEED_TO_SOIL},
      {"soil-to-fertilizer", Range.Type.SOIL_TO_FERTILIZER},
      {"fertilizer-to-water", Range.Type.FERTILIZER_TO_WATER},
      {"water-to-light", Range.Type.WATER_TO_LIGHT},
      {"light-to-temperature", Range.Type.LIGHT_TO_TEMP},
      {"temperature-to-humidity", Range.Type.TEMP_TO_HUMIDITY},
      {"humidity-to-location", Range.Type.HUMID_TO_LOCATION},
    };
    private static Dictionary<Range.Type, List<Range>> conversionMaps = new();

    public static void Main()
    {
      StreamReader data = File.OpenText("./data.txt");
      string? line;
      while ((line = data.ReadLine()) != null)
      {
        if (line.StartsWith("seeds: "))
        {
          var returned = ParseSeeds(data, line);
          seeds = returned.Item1;
          seedsAsRanges = returned.Item2;
        }
        else if (line.Contains("map"))
        {
          (string[], string) returned = ParseMap(data, line);
          string[] content = returned.Item1;
          Range.Type type = titleToType[returned.Item2];

          conversionMaps.Add(type, new());

          foreach (var range in content)
            conversionMaps[type].Add(new(range));
        }
      }

      // Part 1
      List<ulong> locations = new();

      foreach (ulong initial in seeds)
      {
        ulong seed = initial;
        Range.Type targetType = Range.Type.SEED_TO_SOIL;
        while (targetType <= Range.Type.HUMID_TO_LOCATION)
        {
          Range adequate = Range.FindAdequate(conversionMaps[targetType], seed);
          if (adequate is null)
          {
            targetType = (Range.Type)((int)targetType + 1);
            continue; // doesnt change
          }

          ulong converted = adequate.ConvertSource(seed)!.Value;
          seed = converted;
          targetType = (Range.Type)((int)targetType + 1);
        }

        locations.Add(seed);
      }

      Console.WriteLine("Part 1: " + locations.Min());

      // Part 2
      locations = new();

      var counter = 0;

      foreach (SeedRange initialC in seedsAsRanges)
      {
        SeedRange initial = initialC;
        Range adeq = Range.FindAdequate(conversionMaps[Range.Type.SEED_TO_SOIL], initial);
        ulong seed = (ulong)adeq.ConvertSource(initial);
        Range.Type targetType = Range.Type.SEED_TO_SOIL;
        Console.WriteLine("part2 seed = " + seed.ToString());
        while (targetType <= Range.Type.HUMID_TO_LOCATION)
        {
          Range adequate = Range.FindAdequate(conversionMaps[targetType], seed);
          if (adequate is null)
          {
            targetType = (Range.Type)((int)targetType + 1);
            //Console.WriteLine(targetType.ToString() + " `= " + seed);
            continue; // doesnt change
          }

          ulong converted = adequate.ConvertSource(seed)!.Value;
          seed = converted;
          //Console.WriteLine(targetType.ToString() + " = " + seed);
          targetType = (Range.Type)((int)targetType + 1);
        }

        locations.Add(seed);
        Console.WriteLine(counter++);
        Console.WriteLine(seedsAsRanges.Count());
      }

      Console.WriteLine("Part 2: " + locations.Min());
    }
  }
}