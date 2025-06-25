import passport from 'passport';
import { ExtractJwt, Strategy as JwtStrategy, StrategyOptions, VerifiedCallback } from 'passport-jwt';
import { getUserById } from '../models/v1/getUserById';
import { Request } from 'express';

interface JwtPayload {
  id: number;
  // Puedes agregar más campos si tu token los incluye, como email, role, etc.
}

const options: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.KEY_JWT as string,
};

passport.use(
  new JwtStrategy(options, async (payload: JwtPayload, done: VerifiedCallback) => {
    try {
      const user = await getUserById(payload.id);
      return user ? done(null, user) : done(null, false);
    } catch (err) {
      return done(err as Error, false);
    }
  })
);

export default passport;

