import { Playlist } from './../../../../../libs/entities/src/lib/playlist/playlist.entity';
import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {
  Artist,
  CreateUserDto,
  Genre,
  UpdateUserDto,
  User,
} from '@music-match/entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { hashPassword } from '../utils/bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Playlist)
    private readonly playlistRepository: Repository<Playlist>
  ) {}

  async create(createUserDto: CreateUserDto) {
    const userAlreadyExists = await this.userRepository.findOneBy({
      username: createUserDto.username,
    });

    if (userAlreadyExists) {
      throw new ConflictException();
    }

    const password = await hashPassword(createUserDto.password);
    const user = this.userRepository.create({ ...createUserDto, password });
    return await this.userRepository.save(user);
  }

  async findAll() {
    return await this.userRepository.find();
  }

  async findOne(id: number) {
    return await this.userRepository.findOneBy({ id });
  }

  async getAbout(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: {
        playlists: true,
        likedPlaylists: true,
        following: true,
        followers: true,
      },
    });

    return user;
  }

  async toggleFollowing(friendId: number, user: User) {
    const userFromDb = await this.userRepository.findOne({
      where: { id: user.id },
      relations: { following: true },
    });

    const newFriend = await this.userRepository.findOneBy({ id: friendId });

    if (!userFromDb || !newFriend) {
      throw new NotFoundException();
    }

    if (!userFromDb.following.map((f) => f.id).includes(friendId)) {
      userFromDb.following.push(newFriend);
    } else {
      userFromDb.following = userFromDb.following.filter(
        (f) => friendId !== f.id
      );
    }

    return await this.userRepository.save(userFromDb);
  }

  async findOneByUsername(username: string) {
    return await this.userRepository.findOneBy({ username });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    await this.userRepository.update(id, updateUserDto);
    return await this.userRepository.findOneBy({ id });
  }

  async remove(id: number) {
    return await this.userRepository.delete(id);
  }

  async getUsersPlaylists(id: number) {
    const { playlists, likedPlaylists } = await this.userRepository.findOne({
      where: { id },
      relations: { playlists: true, likedPlaylists: true },
    });

    return { playlists, likedPlaylists };
  }

  async calculateCompatibility(id: number, user: User) {
    const users = await this.userRepository.find({
      where: { id: In([id, user.id]) },
      relations: { likedTracks: { release: { genres: true, artists: true } } },
    });

    if (users.length !== 2) {
      throw new NotFoundException();
    }

    const [firstUser, secondUser] = [users[0], users[1]];

    const firstUserArtists = new Map<number, Artist>();
    const secondUserArtists = new Map<number, Artist>();

    firstUser.likedTracks.map((t) =>
      t.release.artists.map((artist) => firstUserArtists.set(artist.id, artist))
    );

    secondUser.likedTracks.map((t) =>
      t.release.artists.map((artist) =>
        secondUserArtists.set(artist.id, artist)
      )
    );

    const artistOccurences: { [artistId: number]: number } = {};

    const artistsInCommon = Array.from(firstUserArtists.values()).filter(
      (artist) => {
        const artistInCommon = secondUserArtists.has(artist.id);

        if (artistInCommon) {
          artistOccurences[artist.id] = artistOccurences[artist.id]
            ? artistOccurences[artist.id] + 1
            : 1;
        }

        return artistInCommon;
      }
    );
    const firstUserGenres = new Map<number, Genre>();
    const secondUserGenres = new Map<number, Genre>();

    firstUser.likedTracks.map((t) =>
      t.release.genres.map((genre) => firstUserGenres.set(genre.id, genre))
    );

    secondUser.likedTracks.map((t) =>
      t.release.genres.map((genre) => secondUserGenres.set(genre.id, genre))
    );

    const genreOccurences: { [genreId: number]: number } = {};

    const genresInCommon = Array.from(firstUserGenres.values()).filter(
      (genre) => {
        const genreInCommon = secondUserGenres.has(genre.id);

        if (genreInCommon) {
          genreOccurences[genre.id] = genreOccurences[genre.id]
            ? genreOccurences[genre.id] + 1
            : 1;
        }

        return genreInCommon;
      }
    );
    const artistResults = [...artistsInCommon]
      .map((a) => {
        return {
          ...a,
          occurences: artistOccurences[a.id],
        };
      })
      .sort((a, b) => a.occurences - b.occurences)
      .reverse();

    const genreResults = [...genresInCommon]
      .map((g) => {
        return {
          ...g,
          occurences: genreOccurences[g.id],
        };
      })
      .sort((a, b) => a.occurences - b.occurences)
      .reverse();
    console.log([...artistResults], [...genreResults]);

    return { artistResults, genreResults };
  }
}
