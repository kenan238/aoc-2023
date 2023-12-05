using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Day5
{
  public struct SeedRange
  {
    public ulong Start;
    public ulong Length;

    public void FindOverlap(Range r)
    {
      if (r == null)
        return;

      // Gotta code this
    }
  }

  public class Range
  {
    public enum Type
    {
      SEED_TO_SOIL,
      SOIL_TO_FERTILIZER,
      FERTILIZER_TO_WATER,
      WATER_TO_LIGHT,
      LIGHT_TO_TEMP,
      TEMP_TO_HUMIDITY,
      HUMID_TO_LOCATION
    }

    public ulong DestinationStart { get; set; }
    public ulong SourceRangeStart { get; set; }
    public ulong Length { get; set; }

    public Range(string toParse)
    {
      string[] split = toParse.Split(' ');
      DestinationStart = Convert.ToUInt64(split[0]);
      SourceRangeStart = Convert.ToUInt64(split[1]);
      Length = Convert.ToUInt64(split[2]);
    }

    public ulong? ConvertSource(ulong source)
    {
      // calculate difference between destination start and source range start
      ulong diff = SourceRangeStart - DestinationStart;
      ulong converted = source - diff;
      bool withinRange = DestinationStart <= converted && (DestinationStart + Length) >= converted;
      if (!withinRange)
        return null; // can't convert
      return converted;
    }

    public ulong? ConvertSource(SeedRange source)
    {
      for (ulong i = source.Start + 1; i < source.Start + Length; i++)
      {
        ulong? conv = ConvertSource(i);
        if (conv != null)
          return conv;
      }

      return null;
    }

    public static Range FindAdequate(List<Range> ranges, ulong nbr)
    {
      Range? adequate = null;

      foreach (Range range in ranges)
      {
        ulong? conversion = range.ConvertSource(nbr);
        if (conversion is not null)
        {
          adequate = range;
          break;
        }
      }

      return adequate;
    }

    public static Range FindAdequate(List<Range> ranges, SeedRange nbr)
    {
      Range? adequate = null;

      foreach (Range range in ranges)
      {
        ulong? conversion = range.ConvertSource(nbr);
        if (conversion is not null)
        {
          adequate = range;
          break;
        }
      }

      return adequate;
    }
  }
}
