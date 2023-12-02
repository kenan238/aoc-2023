#include <vector>
#include <fstream>
#include <iostream>
#include <string>

#define DEBUG 0

typedef struct {
    int r { 0 }, g { 0 }, b { 0 };
    bool boundary;
    std::string data;
} Color;

#ifdef DEBUG
void printColor(Color col) {
    std::cout << col.r << " G= " << col.g << " B= " << col.b << " BOUND= " << col.boundary << " DATA= " << col.data << std::endl;
}
#endif

Color parseColor(std::string str, bool boundary) {
    std::string numStr;
    std::string colorName;
    std::string initialStr = str;

    while (str[0] != ' ') {
        numStr += str[0];
        str = str.substr(1, str.length());
    }

    int num = std::stoi(numStr);

    // skip space
    str = str.substr(1, str.length());

    while (str.length() > 0) {
        colorName += str[0];
        str = str.substr(1, str.length());
    }

    Color col;
    col.data = initialStr;
    col.boundary = boundary;
    
    if (colorName == "red") {
        col.r = num;
    }
    else if (colorName == "green") {
        col.g = num;
    }
    else if (colorName == "blue") {
        col.b = num;
    }
    else {
        throw std::invalid_argument("Invalid color name");
    }

    return col;
}

typedef struct {
    std::string str;
    Color col;
} GetColOut;

class Game {
private:
    int red, green, blue;
    // std::vector<std::vector<Color>> groups;
    std::vector<Color> flat;

    inline GetColOut getColor(std::string str) {
        std::string buf;
        char ch;
        bool boundary = false;
        while (((ch = str[0]) != ',') && str.length() > 0) {
            if (ch == ';') {
                // pop semicolon
                boundary = true;
                break;
            }
            // pop
            str = str.substr(1, str.length());
            buf += ch;
        }

        if (str.length() > 0) {
            // pop comma and space
            str = str.substr(2, str.length());
        }
        return GetColOut {
            str,
            parseColor(buf, boundary)
        };
    }

    inline int getGroupPower(std::vector<Color> group) {
        // get the max of r, g and b, then multiply them
        int r = 0, g = 0, b = 0;
        for (Color c : group) {
            if (c.r > r) {
                r = c.r;
            }
            if (c.g > g) {
                g = c.g;
            }
            if (c.b > b) {
                b = c.b;
            }
        }

        return r * g * b;
    }

    /* inline std::vector<std::vector<Color>> groupColors(std::vector<Color> col) {
        std::vector<std::vector<Color>> groups;
        std::vector<Color> group;
        for (Color c : col) {
            if (c.boundary) {
                groups.push_back(group);
                group.clear();
            }
            else {
                group.push_back(c);
            }
        }
        return groups;
    } */
public:
    int gameId;
    Game(std::string str) {
        if (str.substr(0, 4) != "Game") {
            throw std::invalid_argument("Invalid string");
        }

        std::string gameless = str.substr(5, str.length());

        std::string gameIdStr;
        while (gameless[0] != ':') {
            gameIdStr += gameless[0];
            gameless = gameless.substr(1, gameless.length());
        }

        // pop colon
        gameless = gameless.substr(1, gameless.length());
        // pop space
        gameless = gameless.substr(1, gameless.length());

        this->gameId = std::stoi(gameIdStr);
        std::string idLess = gameless.substr(0, gameless.length());
        std::vector<Color> ungrouped;

        while (idLess.length() > 0) {
            GetColOut out = getColor(idLess);
            // printColor(out.col);
            idLess = out.str;
            ungrouped.push_back(out.col);
        }

        this->flat = ungrouped;
        // this->groups = groupColors(ungrouped); // turns out I don't need this
    }

    bool testFor(int r, int g, int b) {
        for (Color c : this->flat) {
            if (c.r > r || c.g > g || c.b > b) {
                return false;
            }
        }
        return true;
    }

    inline std::vector<Color> makePossible() {
        // get the max of each color
        int r = 0, g = 0, b = 0;
        for (Color c : this->flat) {
            if (c.r > r) {
                r = c.r;
            }
            if (c.g > g) {
                g = c.g;
            }
            if (c.b > b) {
                b = c.b;
            }
        }

        std::vector<Color> possible;
        // add the max of each 3 colors to the possible vector
        possible.push_back(Color { r, 0, 0, false, "" });
        possible.push_back(Color { 0, g, 0, false, "" });
        possible.push_back(Color { 0, 0, b, false, "" });

        return possible;
    }

    inline int getSelfPower() {
        return getGroupPower(makePossible());
    }
};

int main() {
    // Read data from file data.txt into vector
    std::vector<std::string> lines;
    std::ifstream file("data.txt");
    std::string line;
    while (std::getline(file, line)) {
        lines.push_back(line);
    }
    file.close();

    // Part 1
    std::vector<Game> games;
    for (std::string line : lines) {
        games.push_back(Game(line));
    }

    int possibleGamesSum = 0;
    for (Game g : games) {
        if (g.testFor(12, 13, 14)) {
            possibleGamesSum += g.gameId;
        }
    }

    std::cout << "Part 1: " << possibleGamesSum << std::endl;

    // Part 2
    int powerSum = 0;

    for (Game g : games) {
        powerSum += g.getSelfPower();
    }

    std::cout << "Part 2: " << powerSum << std::endl;
}